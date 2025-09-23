import { useState } from "react";
import SignupStep1 from "./SignupComponent1";
import SignupStep2 from "./SignupComponent2";
import SignupStep3 from "./SignupComponent3";
import SignupStep4a from "./SignupComponent4a";
import SignupStep4b from "./SignupComponent4b";
import SignupStep5 from "./SignupComponent5";
import { useForm, FormProvider } from "react-hook-form";
import { signupUser } from "../../Redux/AuthThunks";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../../Loader";
import Toast from "../Shared/Toast";
import authService from "../../appwrite/auth";

const SignupWizard = () => {
  const [step, setStep] = useState(1);
  const [gender, setGender] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "error" });

  const dispatch = useDispatch();
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
      await authService.updateProfile(user.$id, { Status: "online" });
      if (user) {
        setToast({ show: true, message: "Account created successfully!", type: "success" });
        setTimeout(() => navigate("/dashboard"), 1000);
      }
    } catch (error) {
      if (error.code === 409) {
        setToast({ show: true, message: "Email already exists. Please use another email.", type: "error" });
      } else {
        setToast({ show: true, message: error.message || "Signup failed", type: "error" });
      }
    } finally {
      setLoading(false); // always stop loading
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
    <form onSubmit={methods.handleSubmit(onSubmit)}>
      <SignupStep5 prevStep={prevStep} />
      <Loader show={loading} />
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