"use client";
import PageHeader from "@/components/layout/page-header";
import MapView from "@/components/map-view";

const AddProjectPage = () => {
  return (
    <>
      <PageHeader
        title="Projects"
        breadcrumbs={[
          { label: "All Projects", href: "/" },
          { label: "Add project", isCurrentPage: true },
        ]}
      />
      <div className="h-[calc(100vh-10rem)] my-10 ">
        <MapView type="add-project" />
      </div>
    </>
  );
};

export default AddProjectPage;
