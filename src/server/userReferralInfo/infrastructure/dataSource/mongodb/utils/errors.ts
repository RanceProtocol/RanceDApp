export const formatMongoDBValidationError = (
    err: any
): { code: number; message: string | object } => {
    let errors = Object.values(err.errors).map((el: any) => el.message);
    let fields = Object.values(err.errors).map((el: any) => el.path);
    let code = 400;
    if (errors.length > 1) {
        const formattedErrors = errors.join("");
        return {
            code,
            message: formattedErrors,
        };
    } else {
        return {
            code,
            message: { message: errors, field: fields },
        };
    }
};

export const formatMongoDBDuplicateKeyError = (
    err: any
): { code: number; message: string } => {
    const field = Object.keys(err.keyValue);
    const code = 409;
    const error = `A referral record with that ${field} already exists.`;
    return {
        code,
        message: error,
    };
};
