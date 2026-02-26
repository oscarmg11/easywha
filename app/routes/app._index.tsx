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
    <s-page heading="Bienvenido a EasyWha">
      <s-section>
        <s-card padding="500">
          <s-stack gap="small-100">
            <s-heading>
              Tu tema con WhatsApp comienza aquí
            </s-heading>
            <s-text>
              EasyWha te ayuda a conectar con tus clientes con un botón de
              WhatsApp en un solo click desde tu tienda. Ve al editor de temas
              para habilitar el bloque de la app y verlo en vivo.
            </s-text>
            <s-link href={themeEditorUrl}>
              Abrir editor de temas
            </s-link>
          </s-stack>
        </s-card>
      </s-section>
      <s-section>
        <s-card padding="500">
          <s-stack>
            <s-heading>Qué puedes hacer ahora</s-heading>
            <ul>
              <li>Agrega el bloque de EasyWha a tu plantilla de producto.</li>
              <li>Previsualiza el botón de WhatsApp en desktop y móvil.</li>
              <li>Publica cuando te encante el resultado.</li>
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
