import { getModels } from "@/actions/getModels";
import CreateAgent from "./CreateAgent";

export default async function CreateAgentPage() {
  const result = await getModels();

  if (!result.success || !result.data) {
    return (
      <div className="container mx-auto py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Create New AI Agent</h1>
        <div className="text-red-500">
          {result.error || "Failed to load models. Please try again later."}
        </div>
      </div>
    );
  }

  //   return <CreateAgent models={result.data} />;
  return <CreateAgent models={result.data} />;
}
