import "./globals.css";

export default function Rootlayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (

        <html lang="en" suppressHydrationWarning>

            <body suppressHydrationWarning>{children}</body>
        </html>

    );
}