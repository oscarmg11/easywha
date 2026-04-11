import type { ActionFunctionArgs, HeadersFunction, LoaderFunctionArgs } from "react-router";
import { useFetcher, useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { useEffect } from "react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  const appId = process.env.SHOPIFY_API_KEY ?? "";
  const extensionId = process.env.SHOPIFY_THEME_EXTENSION_ID ?? "";

  return { appId, extensionId };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  await authenticate.admin(request);
  return null;
}

export default function Index() {
  const { appId, extensionId } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  useEffect(() => {
    fetcher.submit(null, { method: "post" });
  }, [fetcher])

  return (
    <s-page heading="Whatsapp Chat Button">
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
            <GoToThemeEditorButton
              appId={appId}
              extensionId={extensionId}
            />
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

function GoToThemeEditorButton({
  appId,
  extensionId,
}: {
  appId: string;
  extensionId: string;
}) {

  const baseUrl =
      "https://admin.shopify.com/themes/current/editor?context=apps";
    const url =
      appId && extensionId
        ? `${baseUrl}&activateAppId=${appId}/${extensionId}`
        : baseUrl;

  //@ts-ignore
  return <s-link href={url} target="_top" rel="noreferrer">
    Abrir Theme Editor
  </s-link>;
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
