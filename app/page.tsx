import MapView from "@/components/map-view";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between py-12">
      <div className="w-full h-[800px] max-h-screen ">
        <MapView />
      </div>
    </main>
  );
}
