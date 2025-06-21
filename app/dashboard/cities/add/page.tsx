"use client";
import PageHeader from "@/components/layout/page-header";
import MapView from "@/components/map-view";

const Page = () => {
  return (
    <>
      <PageHeader
        title="Cities"
        breadcrumbs={[
          { label: "All Cities", href: "/" },
          { label: "Add city", isCurrentPage: true },
        ]}
      />
      <div className="h-screen my-10 ">
        <MapView type="add-city" />
      </div>
    </>
  );
};

export default Page;
