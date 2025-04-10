import React, { Fragment, useState} from "react";
import { useTranslation } from "react-i18next";
import { ActionLinks, CardSectionHeader, CheckPoint, ConnectingCheckPoints, Loader, SubmitBar, LinkButton } from "@nudmcdgnpm/digit-ui-react-components";
import BPACaption from "./BPACaption";

const BPAApplicationTimeline = (props) => {
  const { t } = useTranslation();
  const businessService = props.application?.businessService;
  const { isLoading, data } = Digit.Hooks.useWorkflowDetails({
    tenantId: props.application?.tenantId,
    id: props.id,
    moduleCode: businessService,
  });
  
  const [showAllTimeline, setShowAllTimeline]=useState(false);
  function OpenImage(imageSource, index,thumbnailsToShow){
    window.open(thumbnailsToShow?.fullImage?.[0],"_blank");
  }
  const getTimelineCaptions = (checkpoint, index, timeline) => {
    if (checkpoint.state === "INITIATE") {
      const caption = {
        date: Digit.DateUtils.ConvertEpochToDate(props.application?.auditDetails?.createdTime),
        source: props.application?.tradeLicenseDetail?.channel || "",
      };
      return <BPACaption data={caption} />;
    } else {
      const wfComment = Array.isArray(timeline?.[index-1]?.wfComment) 
        ? t(timeline?.[index-1]?.wfComment[0]) 
        : ""; // If wfComment is not an array, set an empty string or handle accordingly
  
      const caption = {
        date: checkpoint?.auditDetails?.lastModified,
        name: checkpoint?.assignes?.[0]?.name,
        mobileNumber: checkpoint?.assignes?.[0]?.mobileNumber,
        comment: wfComment, // Safely handled wfComment
   
        thumbnailsToShow: checkpoint?.thumbnailsToShow,
      };
  
      return <BPACaption data={caption} OpenImage={OpenImage} />;
    }
  };
  

  if (isLoading) {
    return <Loader />;
  }
  const toggleTimeline=()=>{
    setShowAllTimeline((prev)=>!prev);
  }

  return (
    <React.Fragment>
      {!isLoading && (
        <Fragment>
          {data?.timeline?.length > 0 && (
            <CardSectionHeader style={{ marginBottom: "16px", marginTop: "32px" }}>
              {t("CS_APPLICATION_DETAILS_APPLICATION_TIMELINE")}
            </CardSectionHeader>
          )}
          {data?.timeline && data?.timeline?.length === 1 ? (
            <CheckPoint
              isCompleted={true}
              label={t((data?.timeline[0]?.state && `WF_${businessService}_${data.timeline[0].state}`) || "NA")}
              customChild={getTimelineCaptions(data?.timeline[0])}
            />
          ) : (
            <ConnectingCheckPoints>
              {data?.timeline &&
                data?.timeline.slice(0,showAllTimeline? data.timeline.length:2).map((checkpoint, index, arr) => {
                  let timelineStatusPostfix = "";
                  if (window.location.href.includes("/obps")) {
                    if(data?.timeline[index-1]?.state?.includes("BACK_FROM") || data?.timeline[index-1]?.state?.includes("SEND_TO_CITIZEN"))
                        timelineStatusPostfix = `_NOT_DONE`
                    else if(checkpoint?.performedAction === "SEND_TO_ARCHITECT")
                        timelineStatusPostfix = `_BY_ARCHITECT_DONE`
                    else
                    timelineStatusPostfix = index == 0 ? "" : `_DONE`;
                  }
                  return (
                    <React.Fragment key={index}>
                      <CheckPoint
                        keyValue={index}
                        isCompleted={index === 0}
                        label={checkpoint.state ? t(`WF_${businessService}_${checkpoint.state}${timelineStatusPostfix}`) : "NA"}
                        customChild={getTimelineCaptions(checkpoint,index,data.timeline)}
                      />
                    </React.Fragment>
                  );
                })}
            </ConnectingCheckPoints>
          )}
          {data?.timeline?.length > 2 && (
            <LinkButton label={showAllTimeline? t("COLLAPSE") : t("VIEW_TIMELINE")} onClick={toggleTimeline}>
            </LinkButton>   
          )}
        </Fragment>
      )}
      {/* {data && showNextActions(data?.nextActions)} */}
    </React.Fragment>
  );
}

export default BPAApplicationTimeline;