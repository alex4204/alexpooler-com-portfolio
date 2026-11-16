const ThinkingDots = () => (
    <div className="flex gap-1 py-1" aria-label="Thinking">
        {[0, 150, 300].map((delay) => (
            <span
                key={delay}
                className="size-1.5 animate-bounce rounded-full bg-foreground/50"
                style={{ animationDelay: `${delay}ms` }}
            />
        ))}
    </div>
);

export { ThinkingDots };
