import { Theme } from "@clerk/types";
import { dark } from "@clerk/themes";
export const appearance:Theme = {
  // baseTheme: dark

  variables: {
      colorBackground: "#1A1A1C",
      colorText: "#FFFFFF",
      colorTextSecondary: "#A0A0AB"
    },
    elements: {
      headerTitle: "text-3xl",
      cardBox: "w-[600px]", 
      headerSubtitle: "text-md",
      socialButtons: "bg-[#131314] rounded-full hover:bg-[#262629] transition-colors duration-500 ease-in-out",
      socialButtonsBlockButtonText: "text-[#A0A0AB] text-lg",
      socialButtonsProviderIcon: "w-8 h-8 text-xl",
      dividerText: "text-[#A0A0AB] text-lg", 
      dividerLine: "bg-[#3F3F46]",
      profileSection: "px-4 py-6 border-y-1 border-[#1A1A1C]",
      profileSectionPrimaryButton: "text-white hover:text-[#00D4CA]",
      profileSectionTitleText: "font-bold text-base",
      formFieldInput: "bg-[#1E1F21] text-lg text-white border-[#3F3F46] focus:border-[#00D4CA] box-shadow-none ",
      formFieldInputShowPasswordIcon: "text-[#A0A0AB] w-6 h-6 hover:text-[#00D4CA] transition-colors duration-300 ease-in-out", 
      formFieldInputShowPasswordButton: "bg-[#1E1F21]",
      formFieldLabel: "text-[#FFFFFF] text-lg",
      formButtonPrimary: "bg-[#FFFFFF] text-black w-full py-3 px-8 rounded-full hover:bg-[#e6e3e3] transition duration-300 text-lg",
      buttonArrowIcon: "hidden",
      footerActionText: "text-[#828282] text-base",
      footerActionLink: "text-[#00D4CA] text-base hover:text-[#2bf0e2] transition duration-300 hover:no-underline",
      spinner: "text-[#00D4CA]",
      userButtonPopoverActionButton: "text-[#A0A0AB] hover:bg-[#262629] hover:text-[#FFFFFF] transition-colors duration-500 ease-in-out",
      badge: "bg-[#00D4CA] text-black",
      avatarImageActionsUpload: "text-white",
      formButtonReset: "text-red-500",
      navbarButton: "text-white",
    }
}

export default appearance;