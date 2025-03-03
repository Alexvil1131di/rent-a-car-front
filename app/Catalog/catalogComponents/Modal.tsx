import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  Input,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { useState, useEffect } from "react";
import { useCreateVehicle, useUpdateVehicle, vehicleInterface } from "../catalogHooks/hook";
import { toast } from "react-toastify";

const MANUAL_BRANDS = ['Toyota', 'Ford', 'Honda', 'Chevrolet', 'Hyundai'];
const MANUAL_MODELS = {
  Toyota: ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Prius'],
  Ford: ['F-150', 'Focus', 'Explorer', 'Mustang', 'Escape'],
  Honda: ['Civic', 'Accord', 'CR-V', 'Pilot', 'Odyssey'],
  Chevrolet: ['Silverado', 'Equinox', 'Malibu', 'Tahoe', 'Camaro'],
  Hyundai: ['Elantra', 'Sonata', 'Santa Fe', 'Tucson', 'Kona']
};

interface CreateVehicleModalProps {
  isOpen: boolean;
  editedVehicle?: vehicleInterface;
  setEditedVehicle?: (vehicle: any) => void;
  onOpen: () => void;
  onOpenChange: (isOpen: boolean) => void;
  refetch: () => void;
}

export default function CreateVehicleModal({ isOpen, onOpen, onOpenChange, refetch, editedVehicle, setEditedVehicle }: CreateVehicleModalProps) {
  const { mutateAsync: createVehicle } = useCreateVehicle();
  const { mutateAsync: updateVehicle } = useUpdateVehicle();
  const [errors, setErrors] = useState<any>();
  const [submitted, setSubmitted] = useState<any>(null);
  const [dailyPrice, setDailyPrice] = useState("");

  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<"AVAILABLE" | "RENTED" | "COMPLETED">("AVAILABLE");

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1989 }, (_, i) => 1990 + i);
    setAvailableYears(years.reverse());
  }, []);

  useEffect(() => {
    if (editedVehicle) {
      setSelectedBrand(editedVehicle.brand);
      setSelectedModel(editedVehicle.model);
      setSelectedYear(editedVehicle.year);
      setDailyPrice(editedVehicle.dailyPrice.toString());
    } else {
      setSelectedBrand(null);
      setSelectedModel(null);
      setSelectedYear(null);
      setDailyPrice("");
    }
  }, [editedVehicle]);

  const handleDecimalInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = e;
    const value = e.currentTarget.value;
    if (!/[0-9]|\.|Backspace|Delete|ArrowLeft|ArrowRight|Tab/.test(key)) {
      e.preventDefault();
      return;
    }
    if (key === '.' && value.includes('.')) {
      e.preventDefault();
    }
  };

  const handleDailyPriceChange = (value: string) => {
    if (/^\d*\.?\d*$/.test(value)) {
      setDailyPrice(value);
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedBrand || !selectedModel || !selectedYear) {
      toast.error("Please fill all required fields");
      return;
    }

    const data = Object.fromEntries(new FormData(e.currentTarget));
    const vehicleObject = {
      brand: selectedBrand,
      model: selectedModel,
      year: selectedYear,
      licensePlate: data.licensePlate as string,
      status: selectedStatus,
      dailyPrice: Number(dailyPrice).toFixed(2) as unknown as number,
    };

    if (editedVehicle) {
      updateVehicle({ ...vehicleObject, id: editedVehicle.id })
        .then(() => {
          toast.success("Vehicle updated successfully");
          onOpenChange(false);
          refetch();
          setEditedVehicle?.(null);
        })
        .catch(() => toast.error("Error updating vehicle"));
    } else {
      createVehicle(vehicleObject)
        .then(() => {
          toast.success("Vehicle created successfully");
          onOpenChange(false);
          refetch();
        })
        .catch(() => toast.error("Error vehicle already exists"));
    }
    setSubmitted(true);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={(e) => {
      onOpenChange(e);
      if (!e) {
        setEditedVehicle?.(null);
        setSelectedBrand(null);
        setSelectedModel(null);
        setSelectedYear(null);
        setDailyPrice("");
      }
    }}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {editedVehicle ? "Edit Vehicle" : "Add Vehicle"}
            </ModalHeader>
            <ModalBody>
              <Form
                className="w-full justify-center items-center space-y-4"
                validationErrors={errors}
                onReset={() => {
                  setSubmitted(null);
                  setSelectedBrand(null);
                  setSelectedModel(null);
                  setSelectedYear(null);
                  setDailyPrice("");
                }}
                onSubmit={onSubmit}
              >
                <div className="flex flex-col gap-4 items-center max-w-md w-full">
                  <div className="flex gap-2 w-full">
                    <Dropdown>
                      <DropdownTrigger className="w-full justify-start">
                        <Button variant="solid">
                          {selectedBrand || "Select Brand*"}
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu className="h-[200px] overflow-y-auto" aria-label="Vehicle brands" onAction={(key) => setSelectedBrand(key as string)}>
                        {MANUAL_BRANDS.map(brand => <DropdownItem key={brand}>{brand}</DropdownItem>)}
                      </DropdownMenu>
                    </Dropdown>

                    <Dropdown isDisabled={!selectedBrand}>
                      <DropdownTrigger className="w-full justify-start">
                        <Button variant="solid">
                          {selectedModel || "Select Model*"}
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu className="h-[200px] overflow-y-auto" aria-label="Vehicle models" onAction={(key) => setSelectedModel(key as string)}>
                        {selectedBrand
                          ? MANUAL_MODELS[selectedBrand as keyof typeof MANUAL_MODELS]?.map(model => (
                            <DropdownItem key={model}>{model}</DropdownItem>
                          ))
                          : null
                        }
                      </DropdownMenu>
                    </Dropdown>

                    <Dropdown>
                      <DropdownTrigger className="w-full justify-start">
                        <Button variant="solid">
                          {selectedYear || "Select Year*"}
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu className="h-[200px] overflow-y-auto" aria-label="Vehicle years" onAction={(key) => setSelectedYear(Number(key))}>
                        {availableYears.map(year => <DropdownItem key={year}>{year}</DropdownItem>)}
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                  <Dropdown isDisabled={!editedVehicle}>
                    <DropdownTrigger className="w-full justify-start">
                      <Button variant="solid">
                        {selectedStatus || "Select Status*"}
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      aria-label="Vehicle status"
                      onAction={(key) => setSelectedStatus(key as typeof selectedStatus)}
                    >
                      <DropdownItem key="AVAILABLE">AVAILABLE</DropdownItem>
                      <DropdownItem key="RENTED">RENTED</DropdownItem>
                      <DropdownItem key="COMPLETED">COMPLETED</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>

                  <Input
                    isRequired
                    label="License Plate"
                    labelPlacement="outside"
                    name="licensePlate"
                    placeholder="Enter license plate"
                    type="text"
                    defaultValue={editedVehicle?.licensePlate || ""}
                  />
                  <Input
                    isRequired
                    label="Daily Price"
                    labelPlacement="outside"
                    name="dailyPrice"
                    placeholder="Enter daily price"
                    value={dailyPrice}
                    onChange={(e) => handleDailyPriceChange(e.target.value)}
                    onKeyDown={handleDecimalInput}
                    inputMode="decimal"
                    errorMessage={!dailyPrice ? "Daily price is required" : undefined}
                  />
                  {submitted && (
                    <div className="text-red-500 text-sm">
                      {!selectedBrand && "Brand is required\n"}
                      {!selectedModel && "Model is required\n"}
                      {!selectedYear && "Year is required\n"}
                    </div>
                  )}
                </div>
                <ModalFooter className="flex gap-4 w-full px-[-24px]">
                  <Button className="w-full" color="primary" type="submit">
                    {editedVehicle ? "Update" : "Create"}
                  </Button>
                  <Button type="reset" variant="bordered">
                    Reset
                  </Button>
                </ModalFooter>
              </Form>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}