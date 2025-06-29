"use client";
import PageHeader from "@/components/layout/page-header";
import MapView from "@/components/map-view";

const AddLandmarkPage = () => {
  return (
    <>
      <PageHeader
        title="Landmarks"
        breadcrumbs={[
          { label: "All Landmarks", href: "/dashboard/landmarks" },
          { label: "Add landmark", isCurrentPage: true },
        ]}
      />
      <div className="h-[calc(100vh-10rem)] my-10 ">
        <MapView type="add-landmark" />
      </div>
    </>
  );
};

export default AddLandmarkPage;
