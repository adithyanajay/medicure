import { useState } from "react";
import { View } from "react-native";
import SelectLocation from "./steps/SelectLocation";
import SelectCategory from "./steps/SelectCategory";
import SelectDoctor from "./steps/SelectDoctor";
import SelectTime from "./steps/SelectTime";
import Confirmation from "./steps/Confirmation";

export default function Appointments() {
  const [step, setStep] = useState(1);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <View className="flex-1 bg-white">
      {step === 1 && <SelectLocation setSelectedCity={setSelectedCity} setSelectedHospital={setSelectedHospital} nextStep={nextStep} />}
      {step === 2 && <SelectCategory selectedHospital={selectedHospital} setSelectedCategory={setSelectedCategory} nextStep={nextStep} prevStep={prevStep} />}
      {step === 3 && <SelectDoctor selectedHospital={selectedHospital} selectedCategory={selectedCategory} setSelectedDoctor={setSelectedDoctor} nextStep={nextStep} prevStep={prevStep} />}
      {step === 4 && <SelectTime selectedDoctor={selectedDoctor} setSelectedTime={setSelectedTime} nextStep={nextStep} prevStep={prevStep} selectedHospital={selectedHospital}/>}
      {step === 5 && <Confirmation prevStep={prevStep} />}
    </View>
  );
}
