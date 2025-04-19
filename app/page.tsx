import MapView from "@/components/map-view";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between ">
      <div className="w-full  max-h-screen ">
        <MapView />
      </div>
    </main>
  );
}
