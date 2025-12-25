import { brandConfig } from "@typebot.io/branding";
import { env } from "@typebot.io/env";
import Head from "next/head";

const getOrigin = () => {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return env.NEXTAUTH_URL;
};

export const Seo = ({
  title,
  description = brandConfig.description,
  imagePreviewUrl = `${getOrigin()}/images/og.png`,
}: {
  title: string;
  description?: string;
  currentUrl?: string;
  imagePreviewUrl?: string;
}) => {
  const formattedTitle = `${title} | ${brandConfig.displayName}`;

  return (
    <Head>
      <title>{formattedTitle}</title>
      <meta name="title" content={title} />
      <meta property="og:title" content={title} />
      <meta property="og:site_name" content={brandConfig.displayName} />
      <meta property="twitter:title" content={title} />

      <meta name="description" content={description} />
      <meta property="twitter:description" content={description} />
      <meta property="og:description" content={description} />

      <meta property="og:image" content={imagePreviewUrl} />
      <meta property="twitter:image" content={imagePreviewUrl} />

      <meta property="og:type" content="website" />
      <meta property="twitter:card" content="summary_large_image" />

      <meta name="theme-color" content={brandConfig.colors.primary} />
    </Head>
  );
};
