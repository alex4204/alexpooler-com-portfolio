import { TextLink } from "@/components/article/prose";

const NotFound = () => (
    <main className="flex-1 px-5 py-24 text-center">
        <h1 className="text-6xl font-semibold">404</h1>
        <p className="mt-3 text-foreground/60">That page doesn&apos;t exist.</p>
        <p className="mt-4">
            <TextLink href="/">Back to the start</TextLink>
        </p>
    </main>
);

export default NotFound;
