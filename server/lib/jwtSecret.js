const insecureDefaults = new Set([
  "dev_secret",
  "change_this_to_a_long_random_string",
  "replace_with_a_random_secret_at_least_32_characters",
]);

export const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length < 32 || insecureDefaults.has(secret)) {
    throw new Error("Set JWT_SECRET to a unique random value of at least 32 characters.");
  }

  return secret;
};
