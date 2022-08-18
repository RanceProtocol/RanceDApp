import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../Components/Layout";
import AppProviders from "../AppProviders";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <AppProviders>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </AppProviders>
    );
}

export default MyApp;
