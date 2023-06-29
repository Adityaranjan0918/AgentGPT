import type { FC } from "react";
import React, { useState } from "react";
import type { Session } from "next-auth";
import { useTranslation } from "next-i18next";
import clsx from "clsx";
import { get_avatar } from "../../utils/user";
import { FaMoon, FaAdjust, FaSignInAlt } from "react-icons/fa";
import { CgSun } from "react-icons/cg";
import Dialog from "../../ui/dialog";
import { useThemeStore } from "../../stores";
import Menu from "../Menu";
import WindowButton from "../WindowButton";
import type { Theme } from "../../types";

const AuthItem: FC<{
  session: Session | null;
  classname?: string;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}> = ({ session, classname, signOut, signIn }) => {
  const [t] = useTranslation("drawer");
  const [showDialog, setShowDialog] = useState(false);
  const user = session?.user;

  const theme = useThemeStore.use.theme();
  const setTheme = useThemeStore.use.setTheme();

  const getThemeIcon = (theme: Theme) => {
    switch (theme) {
      case "dark":
        return <FaMoon />;
      case "light":
        return <CgSun />;
      case "system":
        return <FaAdjust />;
    }
  };

  const getThemeButtonStyle = (theme: Theme) => {
    switch (theme) {
      case "dark":
        return "text-color-primary hover:text-yellow-500";
      case "light":
        return "text-color-secondary  hover:text-blue-base-light";
      case "system":
        return "text-color-primary";
    }
  };

  const themeOptions = [
    <WindowButton
      key="Light"
      onClick={(): void => setTheme("light")}
      icon={getThemeIcon("light")}
      name="Light"
    />,
    <WindowButton
      key="Dark"
      onClick={(): void => setTheme("dark")}
      icon={getThemeIcon("dark")}
      name="Dark"
    />,
    <WindowButton
      key="System"
      onClick={(): void => setTheme("system")}
      icon={getThemeIcon("system")}
      name="System"
    />,
  ];

  return (
    <div className="flex items-center justify-between">
      <div
        className={clsx(
          "mt-2 flex items-center justify-start gap-3 rounded-md px-2 py-2 text-sm font-semibold text-white",
          "cursor-pointer hover:bg-neutral-800",
          classname
        )}
        onClick={(e) => {
          user ? setShowDialog(true) : void signIn();
        }}
      >
        {user && (
          <img className="h-8 w-8 rounded-full bg-neutral-800" src={get_avatar(user)} alt="" />
        )}
        {!user && (
          <h1 className="ml-2 flex flex-grow items-center gap-2 text-center">
            <FaSignInAlt />
            {t("SIGN_IN")}
          </h1>
        )}

        <span className="sr-only">Your profile</span>
        <span aria-hidden="true">{user?.name}</span>
        <Dialog
          inline
          open={showDialog}
          setOpen={setShowDialog}
          title="My Account"
          icon={<img className="rounded-full bg-neutral-800" src={get_avatar(user)} alt="" />}
          actions={
            <>
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
                onClick={() => {
                  signOut()
                    .then(() => setShowDialog(false))
                    .catch(console.error)
                    .finally(console.log);
                }}
              >
                Sign out
              </button>
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                onClick={() => setShowDialog(false)}
              >
                Close
              </button>
            </>
          }
        >
          <p className="text-sm text-gray-500">Name: {user?.name}</p>
          <p className="text-sm text-gray-500">Email: {user?.email}</p>
        </Dialog>
      </div>
      <Menu
        icon={getThemeIcon(theme)}
        items={themeOptions}
        className={getThemeButtonStyle(theme)}
        buttonPosition="bottom"
      />
    </div>
  );
};

export default AuthItem;