import { useMemo } from "react";
import type { HeadersFunction, LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";
import { boundary } from "@shopify/shopify-app-react-router/server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");
  const shopHandle = shop?.replace(".myshopify.com", "") ?? "";

  return { shopHandle };
};

export default function Index() {
  const { shopHandle } = useLoaderData<typeof loader>();

  const themeEditorUrl = useMemo(() => {
    if (!shopHandle) {
      return "https://admin.shopify.com/themes/current/editor?context=apps";
    }

    return `https://admin.shopify.com/store/${shopHandle}/themes/current/editor?context=apps`;
  }, [shopHandle]);

  const handleOpenThemeEditor = () => {
    const target = window.top ?? window;
    target.location.assign(themeEditorUrl);
  };

  return (
    <s-page heading="Welcome to EasyWha">
      <s-section>
        <s-card padding="500">
          <s-stack gap="small-100">
            <s-heading>
              Your WhatsApp-ready theme starts here
            </s-heading>
            <s-text>
              EasyWha helps you connect customers with a one-click WhatsApp
              experience right from your storefront. Head to the theme editor to
              enable the app block and see it live.
            </s-text>
            <s-link href={themeEditorUrl}>
              Open theme editor
            </s-link>
          </s-stack>
        </s-card>
      </s-section>
      <s-section>
        <s-card padding="500">
          <s-stack>
            <s-heading>What you can do next</s-heading>
            <ul>
              <li>Add the EasyWha block to your product template</li>
              <li>Preview the WhatsApp button on desktop and mobile.</li>
              <li> Publish when you love the result</li>
            </ul>
          </s-stack>
        </s-card>
      </s-section>
    </s-page>
  );
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
