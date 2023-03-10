import React, { useState, useMemo } from "react";
import { useRecoilValue } from "recoil";
import loginInfoDetailAtom from "recoil/loginInfoDetail";
import PropTypes from "prop-types";
import { date2str } from "tools/moment";
import PopupCancel from "./Popup/PopupCancel";
import PopupPay from "./Popup/PopupPay";
import PopupSend from "./Popup/PopupSend";
import ProfileImg from "components/Mypage/ProfileImg";
import theme from "styles/theme";

import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import PaymentRoundedIcon from "@mui/icons-material/PaymentRounded";
import SendRoundedIcon from "@material-ui/icons/SendRounded";

const Info = (props) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        rowGap: "4px",
        width: "fit-content",
      }}
    >
      <div style={{ ...theme.font10_bold, color: theme.gray_text }}>
        {props.title}
      </div>
      <div style={{ ...theme.font12 }}>{props.children}</div>
    </div>
  );
};
Info.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
};

const User = (props) => {
  const isSettlement =
    props.info?.isSettlement === "paid" || props.info?.isSettlement === "sent";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "4px",
        maxWidth: "100%",
      }}
    >
      <div
        style={{
          minWidth: "21px",
          height: "21px",
          overflow: "hidden",
          borderRadius: "50%",
          background: theme.gray_line,
        }}
      >
        <ProfileImg path={props.info?.profileImageUrl} />
      </div>
      <div
        style={{
          ...theme.font10,
          borderRadius: "6px",
          padding: "4px 6px 3px",
          boxShadow: theme.shadow_gray_input_inset,
          color: isSettlement ? theme.white : theme.gray_text,
          background: isSettlement ? theme.purple : theme.gray_background,
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        }}
      >
        {props.info?.nickname}
        {props.isDeparted && !isSettlement ? (
          <span style={theme.font8}>(?????????)</span>
        ) : null}
      </div>
    </div>
  );
};
User.propTypes = {
  info: PropTypes.object,
  isDeparted: PropTypes.bool,
};

const ButtonBody = (props) => {
  const style = {
    display: "flex",
    alignItems: "center",
    columnGap: "4px",
    borderRadius: "6px",
    padding: "3px 5px 3px 6px",
    background: props.disabled ? theme.gray_background : theme.purple,
    ...theme.cursor(props.disabled),
  };
  const styleText = {
    ...theme.font10,
    color: props.disabled ? theme.gray_text : theme.white,
  };
  const styleIcon = {
    fontSize: "15px",
    fill: props.disabled ? theme.gray_text : theme.white,
  };

  const getIcon = (type) => {
    switch (type) {
      case "????????????":
        return <LogoutRoundedIcon style={styleIcon} />;
      case "????????????" || "????????????":
        return <PaymentRoundedIcon style={styleIcon} />;
      case "????????????" || "????????????":
        return <SendRoundedIcon style={styleIcon} />;
    }
  };

  return (
    <div style={style} onClick={props.onClick}>
      <div style={styleText}>{props.type}</div>
      {getIcon(props.type)}
    </div>
  );
};
ButtonBody.propTypes = {
  type: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};
ButtonBody.defaultProps = {
  onClick: () => {},
  disabled: false,
};

const Button = (props) => {
  const [popupCancel, setPopupCancel] = useState(false);
  const [popupPay, setPopupPay] = useState(false);
  const [popupSend, setPopupSend] = useState(false);
  return (
    <>
      <div style={{ minWidth: "fit-content" }}>
        {!props.info?.isDeparted ? (
          <ButtonBody type="????????????" onClick={() => setPopupCancel(true)} />
        ) : !props.info?.settlementTotal ? (
          <ButtonBody type="????????????" onClick={() => setPopupPay(true)} />
        ) : props.isSettlementForMe === "paid" ? (
          <ButtonBody type="????????????" disabled />
        ) : props.isSettlementForMe === "send-required" ? (
          <ButtonBody type="????????????" onClick={() => setPopupSend(true)} />
        ) : props.isSettlementForMe === "sent" ? (
          <ButtonBody type="????????????" disabled />
        ) : (
          <></>
        )}
      </div>
      <PopupCancel
        roomId={props.info?._id}
        popup={popupCancel}
        onClickClose={() => setPopupCancel(false)}
      />
      <PopupPay
        roomId={props.info?._id}
        popup={popupPay}
        onClickClose={() => setPopupPay(false)}
        recallEvent={props.recallEvent}
      />
      <PopupSend
        roomId={props.info?._id}
        popup={popupSend}
        onClickClose={() => setPopupSend(false)}
        recallEvent={props.recallEvent}
      />
    </>
  );
};
Button.propTypes = {
  isSettlementForMe: PropTypes.string,
  recallEvent: PropTypes.func,
  info: PropTypes.object,
};

const HeaderBody = (props) => {
  const userInfoDetail = useRecoilValue(loginInfoDetailAtom);
  const users = props.info?.part ?? [];
  const isSettlementForMe = useMemo(
    () =>
      users.filter((user) => user._id === userInfoDetail?.oid)?.[0]
        ?.isSettlement,
    [userInfoDetail?.oid, JSON.stringify(users)]
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Info title="?????? ?????? & ??????">{date2str(props.info?.time)}</Info>
        <Info title="?????? ??? ?????? ??????">
          <b>{props.info?.part.length}???</b> / {props.info?.maxPartLength}???
        </Info>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginTop: "16px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            overflow: "hidden",
            rowGap: "6px",
            columnGap: "8px",
            paddingRight: "12px",
          }}
        >
          {users.map((item) => (
            <User
              key={item._id}
              info={item}
              isDeparted={props.info?.isDeparted}
            />
          ))}
        </div>
        <Button
          isSettlementForMe={isSettlementForMe}
          recallEvent={props.recallEvent}
          info={props.info}
        />
      </div>
    </div>
  );
};

HeaderBody.propTypes = {
  info: PropTypes.any,
  recallEvent: PropTypes.func,
};
HeaderBody.defaultProps = {
  recallEvent: () => {},
};

export default HeaderBody;
