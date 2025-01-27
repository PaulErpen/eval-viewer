import { Lozenge } from "./lozenge";

export const ModelLozenge = ({
  showFirstModel,
}: {
  showFirstModel: boolean;
}) => {
  return (
    <Lozenge color={showFirstModel ? "#d21400" : "#243cbf"}>
      {showFirstModel ? "Model A" : "Model B"}
    </Lozenge>
  );
};
