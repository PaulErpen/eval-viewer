import { Lozenge } from "./lozenge";

export const ModelLozenge = ({
  showFirstModel,
}: {
  showFirstModel: boolean;
}) => {
  return (
    <Lozenge color={showFirstModel ? "#d21400" : "#243cbf"}>
      {showFirstModel && <span>Model&nbsp;A</span>}
      {!showFirstModel && <span>Model&nbsp;B</span>}
    </Lozenge>
  );
};
