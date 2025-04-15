"use client";
import { SchematicProvider } from "@schematichq/schematic-react";
import SchematicWrapped from "./SchematicWrapped";

export default function SchematicWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const schematicPublicKey = process.env.NEXT_PUBLIC_SCHEMATIC_PUBLISHABLE_KEY;
  if (!schematicPublicKey) {
    throw new Error("Missing NEXT_PUBLIC_SCHEMATIC_PUBLISHABLE_KEY");
  }
  return (
    <SchematicProvider publishableKey={schematicPublicKey}>
      <SchematicWrapped>{children}</SchematicWrapped>
    </SchematicProvider>
  );
}
