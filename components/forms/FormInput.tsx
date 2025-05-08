import { RequiredInput } from "@/types/agent";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const FormInput = ({ input }: { input: RequiredInput }) => {
  const {
    register,
    formState: { errors },
    setValue,
  } = useFormContext();
  const error = errors[input.name];

  switch (input.type) {
    case "textarea":
      return (
        <Textarea
          {...register(input.name)}
          placeholder={input.placeholder || ""}
          className={error ? "border-red-500" : ""}
        />
      );
    case "select":
      return (
        <Select
          onValueChange={(value) => setValue(input.name, value)}
          defaultValue={input.default_value || undefined}
        >
          <SelectTrigger className={error ? "border-red-500" : ""}>
            <SelectValue
              placeholder={input.placeholder || "Select an option"}
            />
          </SelectTrigger>
          <SelectContent>
            {input.options.map((option) => (
              <SelectItem
                key={option.value.toString()}
                value={option.value.toString()}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    case "number":
      return (
        <Input
          type="number"
          {...register(input.name, {
            setValueAs: (value) => (value === "" ? undefined : Number(value)),
          })}
          placeholder={input.placeholder || ""}
          className={error ? "border-red-500" : ""}
        />
      );
    default:
      return (
        <Input
          type={input.type}
          {...register(input.name)}
          placeholder={input.placeholder || ""}
          className={error ? "border-red-500" : ""}
        />
      );
  }
};
