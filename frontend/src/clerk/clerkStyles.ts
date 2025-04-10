import { Theme } from "@clerk/types";
import { dark } from "@clerk/themes";

const isDark = "dark" === localStorage.getItem("vite-ui-theme")


const appearance: Theme = {
  // baseTheme: dark

  variables: {
    colorBackground: `${"dark" === localStorage.getItem("vite-ui-theme") ? "#0a0a0a" : "#FFFFFF"}`,
    colorText: `${"dark" === localStorage.getItem("vite-ui-theme") ? "#FFFFFF" : "#0a0a0a"}`,
  },
  elements: {
    headerTitle: "text-3xl!",
    cardBox: "min-w-[600px]!", 
    headerSubtitle: "text-md!",
    socialButtons: "bg-primary/10! rounded-full! hover:bg-primary/20! transition-colors! duration-500! ease-in-out!",
    socialButtonsBlockButton: "rounded-full!",
    socialButtonsBlockButtonText: "text-muted-foreground! text-lg!",
    socialButtonsProviderIcon: "w-8! h-8! text-xl!",
    dividerText: "text-muted-foreground! text-lg!", 
    dividerLine: "bg-muted-foreground!",
    profileSection: "px-4! py-6! border-y-1! border-muted!",
    profileSectionPrimaryButton: "text-primary! hover:text-highlight!",
    profileSectionTitleText: "font-bold! text-base!",
    formFieldInput: "bg-primary/10! text-foreground! text-base! border! focus:border-highlight! border-2! box-shadow-none! rounded-lg!",
    formFieldInput__deleteConfirmation: "focus:border-red-500!",
    formFieldInputShowPasswordIcon: "text-muted-foreground! w-6! h-6! hover:text-highlight! transition-colors! duration-300! ease-in-out!", 
    formFieldInputShowPasswordButton: "bg-primary/10!",
    formFieldLabel: "text-foreground! text-lg!",
    formButtonPrimary: "bg-primary! text-primary-foreground! w-full! py-3! px-8! rounded-full! hover:bg-primary/90! transition! duration-300! text-lg!",
    buttonArrowIcon: "hidden!",
    footerActionText: "text-muted-foreground! text-base!",
    footerActionLink: "text-highlight! text-base! hover:text-highlight/60! transition! duration-300! hover:no-underline!",
    spinner: "text-highlight!",
    userButtonPopoverActionButton: "text-muted-foreground! hover:bg-primary/10! transition-colors! duration-500! ease-in-out!",
    badge: "bg-highlight! text-primary-foreground!",
    formButtonReset: "text-red-500!",
    navbarButtonText: "text-foreground!",
    navbarButtonIcon: "text-foreground!",
  }
}

export default appearance;