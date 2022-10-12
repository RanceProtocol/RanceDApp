import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
    render() {
        return (
            <Html lang="en">
                <Head>
                    <link rel="manifest" href="/manifest.webmanifest" />
                    <link
                        rel="apple-touch-icon"
                        href="somedir/apple-touch-icon-iphone-60x60.png"
                    />
                    <link
                        rel="apple-touch-icon"
                        sizes="60x60"
                        href="/apple-touch-icon-ipad-76x76.png"
                    />
                    <link
                        rel="apple-touch-icon"
                        sizes="114x114"
                        href="/apple-touch-icon-iphone-retina-120x120.png"
                    />
                    <link
                        rel="apple-touch-icon"
                        sizes="144x144"
                        href="/apple-touch-icon-ipad-retina-152x152.png"
                    />
                    <meta name="theme-color" content="#1C1C1C" />
                    <meta name="description" content="Rance Protocol Dapp" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
