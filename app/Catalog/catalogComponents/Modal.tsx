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
  DateValue,
  RangeValue,
} from "@heroui/react";
import { useState, useEffect } from "react";

import { getReservationsInterface, reservationDetailsInterface, useCreateReservation, useCreateVehicle, useGetReservations, useUpdateReservationStatus, useUpdateVehicle, vehicleInterface } from "../catalogHooks/hook";

import { toast } from "react-toastify";

import DateRangePicker from "./DateRangePicker";
import { useGetClients } from "@/app/Clients/clientHooks/hook";

const MANUAL_BRANDS = [
  'Toyota', 'Ford', 'Honda', 'Chevrolet', 'Hyundai',
  'Nissan', 'BMW', 'Mercedes-Benz', 'Volkswagen', 'Tesla',
  'Kia', 'Subaru', 'Mazda', 'Volvo', 'Audi'
];

const MANUAL_MODELS = {
  Toyota: ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Prius', 'Tacoma', '4Runner', 'Sienna', 'Supra'],
  Ford: ['F-150', 'Focus', 'Explorer', 'Mustang', 'Escape', 'Ranger', 'Edge', 'Expedition', 'Bronco'],
  Honda: ['Civic', 'Accord', 'CR-V', 'Pilot', 'Odyssey', 'HR-V', 'Fit', 'Ridgeline', 'Passport'],
  Chevrolet: ['Silverado', 'Equinox', 'Malibu', 'Tahoe', 'Camaro', 'Traverse', 'Colorado', 'Bolt EV', 'Suburban'],
  Hyundai: ['Elantra', 'Sonata', 'Santa Fe', 'Tucson', 'Kona', 'Palisade', 'Venue', 'Ioniq', 'Nexo'],
  Nissan: ['Altima', 'Rogue', 'Sentra', 'Pathfinder', 'Frontier', 'Murano', 'Maxima', 'Armada', 'Leaf'],
  BMW: ['3 Series', '5 Series', 'X3', 'X5', '7 Series', 'X1', 'X7', 'i4', 'Z4'],
  'Mercedes-Benz': ['C-Class', 'E-Class', 'S-Class', 'GLC', 'GLE', 'A-Class', 'GLA', 'AMG GT', 'Sprinter'],
  Volkswagen: ['Golf', 'Jetta', 'Tiguan', 'Atlas', 'Arteon', 'ID.4', 'Passat', 'Taos', 'Touareg'],
  Tesla: ['Model S', 'Model 3', 'Model X', 'Model Y', 'Cybertruck', 'Roadster', 'Semi'],
  Kia: ['Sorento', 'Sportage', 'Telluride', 'Forte', 'Soul', 'Carnival', 'EV6', 'Niro', 'Rio'],
  Subaru: ['Outback', 'Forester', 'Crosstrek', 'Impreza', 'Ascent', 'Legacy', 'WRX', 'BRZ'],
  Mazda: ['CX-5', 'CX-30', 'Mazda3', 'MX-5 Miata', 'CX-9', 'Mazda6', 'CX-50', 'MX-30'],
  Volvo: ['XC90', 'XC60', 'XC40', 'S90', 'V90', 'C40 Recharge', 'S60', 'V60'],
  Audi: ['A4', 'A6', 'Q5', 'Q7', 'e-tron', 'Q3', 'A3', 'RS6', 'TT']
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
  const { data: clients, isLoading } = useGetClients();

  const { mutateAsync: createVehicle } = useCreateVehicle();
  const { mutateAsync: updateVehicle } = useUpdateVehicle();
  const { mutateAsync: getReservations } = useGetReservations()
  const { mutateAsync: createReservation } = useCreateReservation();
  const { mutateAsync: updateReservationStatus } = useUpdateReservationStatus();

  const [errors, setErrors] = useState<any>();
  const [submitted, setSubmitted] = useState<any>(null);
  const [dailyPrice, setDailyPrice] = useState("");
  const [reservations, setReservations] = useState<reservationDetailsInterface[]>();

  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedRange, setSelectedRange] = useState<RangeValue<DateValue> | null | undefined>(null);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<"AVAILABLE" | "RENTED" | "MAINTENANCE">("AVAILABLE");
  const [selectedClietId, setSelectedClietId] = useState<number>();


  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1989 }, (_, i) => 1990 + i);
    setAvailableYears(years.reverse());
  }, []);

  const statusColorMap: { [key: string]: "success" | "warning" | "danger" | "default" | "primary" | "secondary" | undefined } = {
    CONFIRMED: "success",
    PENDING: "warning",
    CANCELLED: "danger",
  };

  useEffect(() => {
    if (editedVehicle && editedVehicle.id) {
      setSelectedBrand(editedVehicle.brand);
      setSelectedModel(editedVehicle.model);
      setSelectedYear(editedVehicle.year);
      setDailyPrice(editedVehicle.dailyPrice.toString());

      getReservations(editedVehicle.id).then(response => {
        return setReservations(response);
      });

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

    if (editedVehicle && editedVehicle.id) {
      updateVehicle({ id: editedVehicle?.id, client: vehicleObject })
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

  const getCLientNameById = (id?: number) => {
    return clients?.find(client => client.id === id)?.email;
  }

  const resetAllFields = () => {
    setEditedVehicle?.(null);
    setSelectedBrand(null);
    setSelectedModel(null);
    setSelectedYear(null);
    setSelectedStatus("AVAILABLE");
    setDailyPrice("");
    setSelectedRange(null);
    setSelectedClietId(undefined)
    setReservations(undefined);
  }

  const resetReservationFields = () => {
    setSelectedRange(null);
    setSelectedClietId(undefined);
  }

  const createReservationHandler = () => {
    if (!editedVehicle?.id || !selectedClietId || !selectedRange || !selectedRange.start || !selectedRange.end) {
      toast.error("Please fill all required fields");
      return;
    }

    const reservationObject = {
      vehicleId: editedVehicle.id,
      clientId: selectedClietId,
      startDate: selectedRange.start.toString(),
      endDate: selectedRange.end.toString(),
    };

    createReservation(reservationObject)
      .then(() => {
        toast.success("Reservation created successfully");
        resetReservationFields();
        if (editedVehicle && editedVehicle.id) { getReservations(editedVehicle.id).then(response => { return setReservations(response); }); }
      })
      .catch(() => toast.error("Error creating reservation"));
  }

  const updateReservationStatusHandler = (reservationId: number, status: "CONFIRMED" | "PENDING" | "CANCELLED") => {
    updateReservationStatus({ id: reservationId, status })
      .then(() => {
        toast.success("Reservation status updated successfully");
        if (editedVehicle && editedVehicle.id) { getReservations(editedVehicle.id).then(response => { return setReservations(response); }); }
      })
      .catch(() => toast.error("Error updating reservation status"));
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={(e) => { onOpenChange(e); resetAllFields(); }}>
      <ModalContent className="w-full max-w-[750px]">
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {editedVehicle ? "Edit Vehicle" : "Add Vehicle"}
            </ModalHeader>
            <ModalBody>
              <Form
                className="w-full justify-center items-center space-y-4"
                validationErrors={errors}
                onReset={() => { resetAllFields() }}
                onSubmit={onSubmit}
              >
                <div className="flex flex-col gap-4 items-center  w-full">
                  <div className="flex gap-2 w-full">
                    <Dropdown>
                      <DropdownTrigger className="w-full justify-start">
                        <Button variant="solid">
                          {selectedBrand || "Select Brand*"}
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu className="h-[200px] overflow-y-auto" aria-label="Vehicle brands" onAction={(key) => { setSelectedBrand(key as string); setSelectedModel(null) }}>
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
                      <DropdownItem key="MAINTENANCE">MAINTENANCE</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>

                  <Input
                    isRequired
                    label="License Plate"
                    labelPlacement="outside"
                    name="licensePlate"
                    placeholder="Enter license plate"
                    type="text"
                    disabled={!!editedVehicle}
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

                {!!editedVehicle && <div className="flex w-full gap-4">
                  <DateRangePicker reservations={reservations || []} selectedRange={selectedRange} setSelectedRange={setSelectedRange} />

                  <Dropdown>
                    <DropdownTrigger className="w-full justify-start">
                      <Button variant="solid">
                        {getCLientNameById(selectedClietId) || "Select Client*"}
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      aria-label="Clients"
                      onAction={(key) => setSelectedClietId(Number(key))}
                    >
                      {clients?.map(client => (
                        client && client.id ? <DropdownItem key={client.id.toString()}>{client.email}</DropdownItem> : null
                      )) || null}
                    </DropdownMenu>
                  </Dropdown>

                  <Button className="w-full" color="primary" type="button" variant="flat" onPress={() => { createReservationHandler() }}>Add Reservation</Button>
                </div>}

                {reservations && (
                  <div className="w-full ">
                    <h1 className="text-lg font-semibold mb-2">Reservations</h1>

                    <div className="overflow-x-auto">
                      <table className="w-fit max-w-full table-auto overflow-x-scroll">
                        <thead>
                          <tr className="">
                            <th className="p-2 border">Client Email</th>
                            <th className="p-2 border">Status</th>
                            <th className="p-2 border">Start Date</th>
                            <th className="p-2 border">End Date</th>
                            <th className="p-2 border">Total Cost</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reservations.map((reservation) => (
                            <tr key={reservation.id} className="border-t">
                              <td className="p-2 border">{reservation.client.email}</td>
                              <td className="p-2 border">
                                <Dropdown>
                                  <DropdownTrigger className="w-full justify-start">
                                    <Button variant="light" color={statusColorMap[reservation.status || "default"]}>
                                      {reservation.status || "Select status*"}
                                    </Button>
                                  </DropdownTrigger>
                                  <DropdownMenu
                                    aria-label="Clients"
                                    onAction={(key) => updateReservationStatusHandler(reservation.id, key as "CONFIRMED" | "PENDING" | "CANCELLED")}
                                  >
                                    <DropdownItem key="COMPLETED">{"COMPLETED"}</DropdownItem>
                                    <DropdownItem key="CONFIRMED">{"CONFIRMED"}</DropdownItem>
                                    <DropdownItem key="CANCELED">{"CANCELED"}</DropdownItem>

                                  </DropdownMenu>
                                </Dropdown></td>
                              <td className="p-2 border">{reservation.startDate.split("T")[0]}</td>
                              <td className="p-2 border">{reservation.endDate.split("T")[0]}</td>
                              <td className="p-2 border">{reservation.totalCost}</td>

                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                  </div>
                )}


                <ModalFooter className="flex gap-4 w-full px-[-24px]">
                  <Button className="w-full" color="primary" type="submit">
                    {editedVehicle ? "Update" : "Create"}
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

