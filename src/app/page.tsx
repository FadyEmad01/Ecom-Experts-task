import { BundleExperience } from "@/components/bundle-experience";
import { BundleProvider } from "@/components/bundle-provider";

export default function Home() {
  return (
    <div className="min-h-screen bg-white px-0 lg:px-4 py-10">
      <div className="mx-auto max-w-[1197px]">
        <BundleProvider>
          <BundleExperience />
        </BundleProvider>
      </div>
    </div>
  );
}
