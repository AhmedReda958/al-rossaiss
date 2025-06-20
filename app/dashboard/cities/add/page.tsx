import PageHeader from "@/components/layout/page-header";
import MapView from "@/components/map-view";
import React from "react";

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
      <div className="h-screen mt-10">
        <MapView />
      </div>
    </>
  );
};

export default Page;
