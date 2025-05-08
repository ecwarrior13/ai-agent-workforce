import { z } from "zod";
import { RequiredInput } from "@/types/agent";

export const createValidationSchema = (inputs: RequiredInput[]) => {
    const schema: Record<string, z.ZodType> = {};

    for (const input of inputs) {
        let fieldSchema: z.ZodString | z.ZodNumber;

        switch (input.type) {
            case "number":
                fieldSchema = z.number();
                break;
            case "url":
                fieldSchema = z.string().url();
                break;
            case "email":
                fieldSchema = z.string().email();
                break;
            case "date":
                fieldSchema = z.string().datetime();
                break;
            default:
                fieldSchema = z.string();
        }

        if (input.validation_rules) {
            if (input.validation_rules.required) {
                fieldSchema = fieldSchema.min(1, "This field is required");
            }
            if (input.validation_rules.minLength) {
                fieldSchema = fieldSchema.min(input.validation_rules.minLength);
            }
            if (input.validation_rules.maxLength) {
                fieldSchema = fieldSchema.max(input.validation_rules.maxLength);
            }
            if (input.validation_rules.pattern) {
                fieldSchema = fieldSchema.regex(new RegExp(input.validation_rules.pattern));
            }
        }

        schema[input.name] = fieldSchema;
    }

    return z.object(schema);
};

export type FormData = z.infer<ReturnType<typeof createValidationSchema>>;