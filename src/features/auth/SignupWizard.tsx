import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { useState } from "react";
import SignupStep1 from "./components/SignupStep1";
import SignupStep2 from "./components/SignupStep2";
import SignupStep3 from "./components/SignupStep3";
import SignupStep4a from "./components/SignupStep4a";
import SignupStep4b from "./components/SignupStep4b";
import SignupStep5 from "./components/SignupStep5";
import { useForm, FormProvider } from "react-hook-form";
import { signupUser } from "@/Redux/AuthThunks";
import { useNavigate } from "react-router-dom";
import Toast from "@/shared/feedback/AppToast";
import authService from "@/appwrite/auth";

const SignupWizard = () => {
  const [step, setStep] = useState(1);
  const [gender, setGender] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "error" });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // ✅ react-hook-form setup
  const methods = useForm({
    defaultValues: {
      Name: "",
      Email: "",
      Password: "",
      Topics: [],
      Level: "",
      Availability: "",
      Timezone: null,
      Bio: "",
      Avatar: "", // ✅ new field
    },
  });

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 6));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

    const onSubmit = async (data) => {
    if (step !== 6) return; // do nothing on intermediate steps
    setLoading(true);
    const finalData = { ...data, Timezone: data.Timezone?.value };

    try {
      const user = await dispatch(signupUser(finalData)).unwrap();
      if (user) {
        authService.updateProfile(user.$id, { Status: "online" }).catch((error) => {
          console.error("Failed to update signup status:", error);
        });
        setToast({ show: true, message: "Account created successfully!", type: "success" });
        setIsRedirecting(true);
        window.setTimeout(() => navigate("/dashboard"), 280);
      }
    } catch (error) {
      if (error.code === 409) {
        setToast({ show: true, message: "Email already exists. Please use another email.", type: "error" });
      } else {
        setToast({ show: true, message: error.message || "Signup failed", type: "error" });
      }
      setLoading(false);
    }
  };


  return (
    <FormProvider {...methods}>
  {step < 6 ? (
    // intermediate steps, no form submit
    <>
      {step === 1 && <SignupStep1 nextStep={nextStep} />}
      {step === 2 && <SignupStep2 nextStep={nextStep} prevStep={prevStep} />}
      {step === 3 && <SignupStep3 nextStep={nextStep} prevStep={prevStep} />}
      {step === 4 && <SignupStep4a nextStep={nextStep} prevStep={prevStep} setGender={setGender} />}
      {step === 5 && <SignupStep4b nextStep={nextStep} prevStep={prevStep} gender={gender} />}
    </>
  ) : (
    // last step has the submit form
    <form
      onSubmit={methods.handleSubmit(onSubmit)}
      className={isRedirecting ? "signup-fade-out" : ""}
    >
      <SignupStep5 prevStep={prevStep} />
    </form>
  )}

  <Toast
    show={toast.show}
    message={toast.message}
    type={toast.type}
    onClose={() => setToast({ ...toast, show: false })}
  />
  </FormProvider>

  );
};

export default SignupWizard;