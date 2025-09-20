import { useState } from "react";
import SignupStep1 from "./SignupComponent1";
import SignupStep2 from "./SignupComponent2";
import SignupStep3 from "./SignupComponent3";
import SignupStep4 from "./SignupComponent4";
import { useForm, FormProvider } from "react-hook-form";

const SignupWizard = () => {
  const [step, setStep] = useState(1);

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
    },
  });

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const onSubmit = (data) => {
    console.log("🔥 Final data:", data);
    // call API here (Appwrite, Firebase, etc.)
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        {step === 1 && <SignupStep1 nextStep={nextStep} />}
        {step === 2 && <SignupStep2 nextStep={nextStep} prevStep={prevStep} />}
        {step === 3 && <SignupStep3 nextStep={nextStep} prevStep={prevStep} />}
        {step === 4 && <SignupStep4 prevStep={prevStep} />}
      </form>
    </FormProvider>
  );
};

export default SignupWizard;