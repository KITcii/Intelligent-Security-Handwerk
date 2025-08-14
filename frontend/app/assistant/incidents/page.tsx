import EmergencyContactPanel from "@/components/assistant/incidents/EmergencyContactPanel";
import IncidentSignsPanel from "@/components/assistant/incidents/IncidentSignsPanel";
import LinkListPanel from "@/components/assistant/incidents/LinkListPanel";
import ReportPanel from "@/components/assistant/incidents/ReportPanel";
import StepByStepPanel from "@/components/assistant/incidents/StepByStepPanel";
import Header from "@/components/assistant/shared/Header";

const page = () => {
  return (
    <div>
      <Header title="Sicherheitsvorfälle" />
      <div className="grid grid-cols-12 gap-4">
        <EmergencyContactPanel className="col-span-12" />
        <IncidentSignsPanel className="col-span-12 lg:col-span-6" />
        <StepByStepPanel className="col-span-12 lg:col-span-6" />
        <ReportPanel className="col-span-12" />
        <LinkListPanel className="col-span-12" />
      </div>
    </div>
  );
};

export default page;
