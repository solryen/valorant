import { Platform } from "react-native";
import Constants from "expo-constants";
import Purchases, {
  LOG_LEVEL,
  PACKAGE_TYPE,
  PURCHASE_TYPE,
  PURCHASES_ERROR_CODE,
  type CustomerInfo,
  type PurchasesOffering,
  type PurchasesPackage,
  type PurchasesStoreProduct,
} from "react-native-purchases";
import RevenueCatUI, { PAYWALL_RESULT } from "react-native-purchases-ui";

const IOS_API_KEY = "appl_DASmmarOQIRbLZlNHSUNTViYJRf";
export const RC_PRIMARY_PRODUCT_ID = "com.todayler.yearly";
export const RC_DISCOUNT_PRODUCT_ID = "com.todayler.yearly.discount";
export const RC_MONTHLY_PRODUCT_ID = "com.todayler.month";
let hasConfiguredRevenueCat = false;

function isNativePurchasesRuntimeSupported(): boolean {
  if (Platform.OS !== "ios") return false;
  if (Constants.appOwnership === "expo") return false;
  return (
    typeof Purchases.configure === "function" &&
    typeof Purchases.getOfferings === "function" &&
    typeof Purchases.purchasePackage === "function"
  );
}

function isNativeRevenueCatPaywallRuntimeSupported(): boolean {
  if (!isNativePurchasesRuntimeSupported()) return false;
  return typeof RevenueCatUI.presentPaywall === "function";
}

function logUnsupportedRuntimeOnce() {
  try {
    const isExpoGo =
      Constants.appOwnership === "expo" ||
      Boolean((globalThis as any)?.expo?.modules?.ExpoGo);
    if (isExpoGo) {
      console.log("RevenueCat native paywall requires a development build.");
    } else if (__DEV__) {
      console.log(
        "RevenueCat native modules are not available in this runtime, skipping native paywall."
      );
    }
  } catch {
    // no-op
  }
}

export type RevenueCatPurchaseResult =
  | { status: "purchased"; customerInfo: CustomerInfo; productIdentifier: string }
  | { status: "cancelled" }
  | { status: "unavailable" }
  | { status: "no_offering" }
  | { status: "error" };

export type RevenueCatRestoreResult =
  | { status: "restored"; customerInfo: CustomerInfo }
  | { status: "no_active_entitlement"; customerInfo: CustomerInfo }
  | { status: "unavailable" }
  | { status: "error" };

export type RevenueCatPaywallPackage = {
  package: PurchasesPackage | null;
  storeProduct: PurchasesStoreProduct | null;
  source: "offering" | "direct";
  productIdentifier: string;
  packageIdentifier: string;
  priceLabel: string;
  productTitle: string;
};

export type RevenueCatPaywallPackagesResult =
  | {
      status: "ready";
      primary: RevenueCatPaywallPackage;
      monthly: RevenueCatPaywallPackage | null;
      discount: RevenueCatPaywallPackage | null;
      offeringIdentifier: string;
    }
  | { status: "unavailable" }
  | { status: "no_offering" };

function logRevenueCatBreadcrumb(step: string, payload?: unknown) {
  try {
    if (payload !== undefined) {
      console.log(`[startup][revenuecat] ${step}`, payload);
      return;
    }
    console.log(`[startup][revenuecat] ${step}`);
  } catch {
    // no-op
  }
}

export async function initializeRevenueCat() {
  if (!isNativePurchasesRuntimeSupported()) {
    logUnsupportedRuntimeOnce();
    return;
  }

  if (hasConfiguredRevenueCat) return;
  try {
    if (__DEV__) {
      Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
    }
    logRevenueCatBreadcrumb("configure_start");
    await Purchases.configure({ apiKey: IOS_API_KEY });
    hasConfiguredRevenueCat = true;
    logRevenueCatBreadcrumb("configure_done");
  } catch (error) {
    hasConfiguredRevenueCat = false;
    logRevenueCatBreadcrumb("configure_failed", error);
  }
}

function selectDefaultPackage(packages: PurchasesPackage[], annual?: PurchasesPackage | null) {
  if (annual) return annual;
  return (
    packages.find((aPackage) => aPackage.packageType === PACKAGE_TYPE.ANNUAL) ??
    packages[0] ??
    null
  );
}

function toPaywallPackage(pkg: PurchasesPackage): RevenueCatPaywallPackage {
  const priceLabel = pkg.product.priceString || "";
  const productTitle = pkg.product.title || "Todayler Annual";
  return {
    package: pkg,
    storeProduct: null,
    source: "offering",
    productIdentifier: pkg.product.identifier,
    packageIdentifier: pkg.identifier,
    priceLabel,
    productTitle,
  };
}

function toDirectPaywallPackage(product: PurchasesStoreProduct): RevenueCatPaywallPackage {
  const priceLabel = product.priceString || "";
  const productTitle = product.title || "Todayler Annual";
  return {
    package: null,
    storeProduct: product,
    source: "direct",
    productIdentifier: product.identifier,
    packageIdentifier: `direct:${product.identifier}`,
    priceLabel,
    productTitle,
  };
}

function selectPackageByProductId(offering: PurchasesOffering, productId: string) {
  return offering.availablePackages.find((pkg) => pkg.product.identifier === productId) ?? null;
}

function isPurchaseCancelled(error: unknown): boolean {
  const maybeError = error as { code?: unknown; userCancelled?: unknown } | null;
  return (
    maybeError?.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR ||
    maybeError?.userCancelled === true
  );
}

export async function purchaseDefaultRevenueCatPackage(): Promise<RevenueCatPurchaseResult> {
  if (!isNativePurchasesRuntimeSupported()) {
    logUnsupportedRuntimeOnce();
    return { status: "unavailable" };
  }

  await initializeRevenueCat();
  if (!hasConfiguredRevenueCat) {
    return { status: "unavailable" };
  }

  const packages = await getRevenueCatPaywallPackages();
  if (packages.status === "no_offering") return { status: "no_offering" };
  if (packages.status === "unavailable") return { status: "unavailable" };
  return purchaseRevenueCatPackage(packages.primary);
}

async function getDirectStoreProductPackages(): Promise<RevenueCatPaywallPackagesResult> {
  try {
    const products = await Purchases.getProducts(
      [RC_PRIMARY_PRODUCT_ID, RC_MONTHLY_PRODUCT_ID, RC_DISCOUNT_PRODUCT_ID],
      PURCHASE_TYPE.SUBS
    );
    if (!products.length) {
      return { status: "no_offering" };
    }

    const explicitPrimary = products.find((product) => product.identifier === RC_PRIMARY_PRODUCT_ID) ?? null;
    const primary = explicitPrimary ?? products[0] ?? null;
    if (!primary) {
      return { status: "no_offering" };
    }

    const explicitDiscount = products.find((product) => product.identifier === RC_DISCOUNT_PRODUCT_ID) ?? null;
    const discount = explicitDiscount && explicitDiscount.identifier !== primary.identifier
      ? explicitDiscount
      : null;
    const explicitMonthly = products.find((product) => product.identifier === RC_MONTHLY_PRODUCT_ID) ?? null;
    const monthly = explicitMonthly && explicitMonthly.identifier !== primary.identifier
      ? explicitMonthly
      : null;

    logRevenueCatBreadcrumb("direct_products_ready", {
      primary: primary.identifier,
      hasMonthly: Boolean(monthly),
      hasDiscount: Boolean(discount),
    });

    return {
      status: "ready",
      primary: toDirectPaywallPackage(primary),
      monthly: monthly ? toDirectPaywallPackage(monthly) : null,
      discount: discount ? toDirectPaywallPackage(discount) : null,
      offeringIdentifier: "direct_store_products",
    };
  } catch (error) {
    logRevenueCatBreadcrumb("direct_products_failed", error);
    return { status: "unavailable" };
  }
}

async function getDirectProductsByIds(
  productIds: string[]
): Promise<Map<string, PurchasesStoreProduct>> {
  const uniqueIds = Array.from(new Set(productIds.filter(Boolean)));
  if (!uniqueIds.length) return new Map();
  const products = await Purchases.getProducts(uniqueIds, PURCHASE_TYPE.SUBS);
  return new Map(products.map((product) => [product.identifier, product]));
}

export async function getRevenueCatPaywallPackages(): Promise<RevenueCatPaywallPackagesResult> {
  if (!isNativePurchasesRuntimeSupported()) {
    logUnsupportedRuntimeOnce();
    return { status: "unavailable" };
  }

  await initializeRevenueCat();
  if (!hasConfiguredRevenueCat) {
    return { status: "unavailable" };
  }

  try {
    const offerings = await Purchases.getOfferings();
    const fallbackOffering = Object.values(offerings.all ?? {})[0] ?? null;
    const current = offerings.current ?? fallbackOffering;
    if (!current || current.availablePackages.length === 0) {
      logRevenueCatBreadcrumb("paywall_packages_no_offering_trying_direct");
      return await getDirectStoreProductPackages();
    }

    const explicitPrimary = selectPackageByProductId(current, RC_PRIMARY_PRODUCT_ID);
    const primary = explicitPrimary ?? selectDefaultPackage(current.availablePackages, current.annual ?? null);
    if (!primary) {
      return { status: "no_offering" };
    }

    const explicitDiscount = selectPackageByProductId(current, RC_DISCOUNT_PRODUCT_ID);
    let discount =
      explicitDiscount && explicitDiscount.product.identifier !== primary.product.identifier
        ? toPaywallPackage(explicitDiscount)
        : null;
    if (discount) {
      logRevenueCatBreadcrumb("discount_from_offering", {
        productIdentifier: discount.productIdentifier,
      });
    }

    const explicitMonthly = selectPackageByProductId(current, RC_MONTHLY_PRODUCT_ID);
    const monthlyFromType = current.availablePackages.find((pkg) => pkg.packageType === PACKAGE_TYPE.MONTHLY) ?? null;
    const monthlyCandidate = explicitMonthly ?? monthlyFromType;
    let monthly =
      monthlyCandidate && monthlyCandidate.product.identifier !== primary.product.identifier
        ? toPaywallPackage(monthlyCandidate)
        : null;
    if (monthly && explicitMonthly) {
      logRevenueCatBreadcrumb("monthly_from_offering", {
        productIdentifier: monthly.productIdentifier,
      });
    }

    if (!discount || !monthly) {
      try {
        const fallbackIds: string[] = [];
        if (!discount) fallbackIds.push(RC_DISCOUNT_PRODUCT_ID);
        if (!monthly) fallbackIds.push(RC_MONTHLY_PRODUCT_ID);
        const directProducts = await getDirectProductsByIds(fallbackIds);

        if (!discount) {
          const directDiscount = directProducts.get(RC_DISCOUNT_PRODUCT_ID) ?? null;
          if (directDiscount && directDiscount.identifier !== primary.product.identifier) {
            discount = toDirectPaywallPackage(directDiscount);
            logRevenueCatBreadcrumb("discount_from_direct_fallback", {
              productIdentifier: discount.productIdentifier,
            });
          } else {
            logRevenueCatBreadcrumb("discount_not_found");
          }
        }

        if (!monthly) {
          const directMonthly = directProducts.get(RC_MONTHLY_PRODUCT_ID) ?? null;
          if (directMonthly && directMonthly.identifier !== primary.product.identifier) {
            monthly = toDirectPaywallPackage(directMonthly);
            logRevenueCatBreadcrumb("monthly_from_direct_fallback", {
              productIdentifier: monthly.productIdentifier,
            });
          }
        }
      } catch (error) {
        if (!discount) {
          logRevenueCatBreadcrumb("discount_not_found", { reason: "direct_fallback_failed", error });
        }
      }
    }

    return {
      status: "ready",
      primary: toPaywallPackage(primary),
      monthly,
      discount,
      offeringIdentifier: current.identifier,
    };
  } catch (error) {
    logRevenueCatBreadcrumb("paywall_packages_failed", error);
    return await getDirectStoreProductPackages();
  }
}

export async function purchaseRevenueCatPackage(pkg: RevenueCatPaywallPackage): Promise<RevenueCatPurchaseResult> {
  if (!isNativePurchasesRuntimeSupported()) {
    logUnsupportedRuntimeOnce();
    return { status: "unavailable" };
  }

  await initializeRevenueCat();
  if (!hasConfiguredRevenueCat) {
    return { status: "unavailable" };
  }

  try {
    const result = pkg.package
      ? await Purchases.purchasePackage(pkg.package)
      : pkg.storeProduct
        ? await Purchases.purchaseStoreProduct(pkg.storeProduct)
        : null;
    if (!result) {
      return { status: "error" };
    }
    logRevenueCatBreadcrumb("purchase_done", {
      productIdentifier: result.productIdentifier,
      packageIdentifier: pkg.packageIdentifier,
      source: pkg.source,
    });
    return {
      status: "purchased",
      customerInfo: result.customerInfo,
      productIdentifier: result.productIdentifier,
    };
  } catch (error) {
    if (isPurchaseCancelled(error)) {
      logRevenueCatBreadcrumb("purchase_cancelled");
      return { status: "cancelled" };
    }
    logRevenueCatBreadcrumb("purchase_failed", error);
    return { status: "error" };
  }
}

export async function restoreRevenueCatPurchases(): Promise<RevenueCatRestoreResult> {
  if (!isNativePurchasesRuntimeSupported()) {
    logUnsupportedRuntimeOnce();
    return { status: "unavailable" };
  }

  await initializeRevenueCat();
  if (!hasConfiguredRevenueCat) {
    return { status: "unavailable" };
  }

  try {
    const customerInfo = await Purchases.restorePurchases();
    const hasActiveEntitlements = Object.keys(customerInfo.entitlements.active ?? {}).length > 0;
    if (!hasActiveEntitlements) {
      return { status: "no_active_entitlement", customerInfo };
    }
    return { status: "restored", customerInfo };
  } catch (error) {
    logRevenueCatBreadcrumb("restore_failed", error);
    return { status: "error" };
  }
}

export async function presentRevenueCatPaywallResult(): Promise<PAYWALL_RESULT | null> {
  if (!isNativeRevenueCatPaywallRuntimeSupported()) {
    logUnsupportedRuntimeOnce();
    return null;
  }

  try {
    await initializeRevenueCat();
    const offerings = await Purchases.getOfferings();
    if (!offerings.current || offerings.current.availablePackages.length === 0) {
      logRevenueCatBreadcrumb("present_paywall_skipped_no_offering");
      return null;
    }
    return await RevenueCatUI.presentPaywall();
  } catch (error) {
    logRevenueCatBreadcrumb("present_paywall_failed", error);
    return null;
  }
}

export async function hasActiveRevenueCatEntitlement(): Promise<boolean> {
  if (!isNativePurchasesRuntimeSupported()) return false;
  try {
    await initializeRevenueCat();
    const info = await Purchases.getCustomerInfo();
    return Object.keys(info.entitlements.active ?? {}).length > 0;
  } catch {
    return false;
  }
}
