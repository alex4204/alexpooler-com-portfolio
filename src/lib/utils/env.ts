/** A positive number from the environment, or `fallback` if unset or invalid. */
const numberFromEnv = (name: string, fallback: number) => {
    const value = Number(process.env[name]);
    return Number.isFinite(value) && value > 0 ? value : fallback;
};

export { numberFromEnv };
