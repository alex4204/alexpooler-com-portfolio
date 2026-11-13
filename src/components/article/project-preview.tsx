/** Stand-in "screenshot" until real project images exist. */
const ProjectPreview = ({ hue = 150 }: { hue?: number }) => (
    <div
        aria-hidden
        className="relative my-4 h-56 overflow-hidden rounded-xl border border-foreground/10"
        style={{
            background: `linear-gradient(135deg, hsl(${hue} 60% 20%), hsl(${hue + 40} 70% 8%))`,
        }}
    >
        <div
            className="absolute top-0 -left-4 h-1/2 w-1/2 rounded-full blur-2xl"
            style={{ background: `hsl(${hue} 80% 55% / 0.5)` }}
        />
        <div className="absolute top-1/4 right-[10%] h-2/3 w-2/3 rounded-md border border-white/15 bg-black/40 p-[6%]">
            {[80, 55, 70].map((width) => (
                <div
                    key={width}
                    className="mb-[6%] h-2 rounded bg-white/15"
                    style={{ width: `${width}%` }}
                />
            ))}
        </div>
    </div>
);

export { ProjectPreview };
