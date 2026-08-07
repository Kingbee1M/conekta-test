'use client';

import { useEffect, useState, useSyncExternalStore, ChangeEvent, FormEvent, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchListerByUuid, clearSelectedLister } from '@/shared/store/adminListerSlice';
import { ListerProfile } from '@/shared/service/admin/types/listerTypes';
import Combobox, { ComboboxOption } from '../ui/ComboBox';
import { 
  LuX, 
  LuUser, 
  LuMail, 
  LuPhone, 
  LuMapPin, 
  LuCalendar, 
  LuPencil, 
  LuSave, 
  LuArrowLeft,
  LuCheckCheck,
  LuGlobe,
  LuHash,
  LuClock,
  LuFlag
} from 'react-icons/lu';

// --- Region Enums & Mapping ---
export enum NigeriaStateEnum {
  ABIA = "Abia",
  ADAMAWA = "Adamawa",
  AKWA_IBOM = "Akwa Ibom",
  ANAMBRA = "Anambra",
  BAUCHI = "Bauchi",
  BAYELSA = "Bayelsa",
  BENUE = "Benue",
  BORNO = "Borno",
  CROSS_RIVER = "Cross River",
  DELTA = "Delta",
  EBONYI = "Ebonyi",
  EDO = "Edo",
  EKITI = "Ekiti",
  ENUGU = "Enugu",
  FCT = "Federal Capital Territory",
  GOMBE = "Gombe",
  IMO = "Imo",
  JIGAWA = "Jigawa",
  KADUNA = "Kaduna",
  KANO = "Kano",
  KATSINA = "Katsina",
  KEBBI = "Kebbi",
  KOGI = "Kogi",
  KWARA = "Kwara",
  LAGOS = "Lagos",
  NASARAWA = "Nasarawa",
  NIGER = "Niger",
  OGUN = "Ogun",
  ONDO = "Ondo",
  OSUN = "Osun",
  OYO = "Oyo",
  PLATEAU = "Plateau",
  RIVERS = "Rivers",
  SOKOTO = "Sokoto",
  TARABA = "Taraba",
  YOBE = "Yobe",
  ZAMFARA = "Zamfara"
}

export const NIGERIA_LGA_MAP: Record<NigeriaStateEnum, string[]> = {
  [NigeriaStateEnum.ABIA]: ["Aba North", "Aba South", "Arochukwu", "Bende", "Ikwuano", "Isiala Ngwa North", "Isiala Ngwa South", "Isuikwuato", "Obi Ngwa", "Ohafia", "Osisioma", "Ugwunagbo", "Ukwa East", "Ukwa West", "Umuahia North", "Umuahia South", "Umu Nneochi"],
  [NigeriaStateEnum.ADAMAWA]: ["Demsa", "Fufure", "Ganye", "Gayuk", "Gombi", "Grei", "Hong", "Jada", "Lamurde", "Madagali", "Maiha", "Mayo Belwa", "Michika", "Mubi North", "Mubi South", "Numan", "Shelleng", "Song", "Toungo", "Yola North", "Yola South"],
  [NigeriaStateEnum.AKWA_IBOM]: ["Abak", "Eastern Obolo", "Eket", "Esit Eket", "Essien Udim", "Etim Ekpo", "Etinan", "Ibeno", "Ibesikpo Asutan", "Ibiono-Ibom", "Ika", "Ikono", "Ikot Abasi", "Ikot Ekpene", "Ini", "Itu", "Mbo", "Mkpat-Enin", "Nsit-Atai", "Nsit-Ibom", "Nsit-Ubium", "Obot Akara", "Okobo", "Onna", "Oron", "Oruk Anam", "Udung-Uko", "Ukanafun", "Uruan", "Urue-Offong/Oruko", "Uyo"],
  [NigeriaStateEnum.ANAMBRA]: ["Aguata", "Anambra East", "Anambra West", "Anaocha", "Awka North", "Awka South", "Ayamelum", "Dunukofia", "Ekwusigo", "Idemili North", "Idemili South", "Ihiala", "Njikoka", "Nnewi North", "Nnewi South", "Ogbaru", "Onitsha North", "Onitsha South", "Orumba North", "Orumba South", "Oyi"],
  [NigeriaStateEnum.BAUCHI]: ["Alkaleri", "Bauchi", "Bogoro", "Dambam", "Darazo", "Dass", "Gamawa", "Ganjuwa", "Giade", "Itas/Gadau", "Jama'are", "Katagum", "Kirfi", "Misau", "Ningi", "Shira", "Tafawa Balewa", "Toro", "Warji", "Zaki"],
  [NigeriaStateEnum.BAYELSA]: ["Brass", "Ekeremor", "Kolokuma/Opokuma", "Nembe", "Ogbia", "Sagbama", "Southern Ijaw", "Yenagoa"],
  [NigeriaStateEnum.BENUE]: ["Agatu", "Apa", "Ado", "Buruku", "Gboko", "Guma", "Gwer East", "Gwer West", "Katsina-Ala", "Konshisha", "Kwande", "Logo", "Makurdi", "Obi", "Ogbadibo", "Ohimini", "Oju", "Okpokwu", "Otukpo", "Tarka", "Ukum", "Ushongo", "Vandeikya"],
  [NigeriaStateEnum.BORNO]: ["Abadam", "Askira/Uba", "Bama", "Bayo", "Biu", "Chibok", "Damboa", "Dikwa", "Gubio", "Guzamala", "Gwoza", "Hawul", "Jere", "Kaga", "Kala/Balge", "Konduga", "Kukawa", "Kwaya Kusar", "Mafa", "Magumeri", "Maiduguri", "Marte", "Mobbar", "Monguno", "Ngala", "Nganzai", "Shani"],
  [NigeriaStateEnum.CROSS_RIVER]: ["Abi", "Akamkpa", "Akpabuyo", "Bakassi", "Bekwarya", "Biase", "Boki", "Calabar Municipal", "Calabar South", "Etung", "Ikom", "Obanliku", "Obubra", "Obudu", "Odukpani", "Ogoja", "Yakuur", "Yala"],
  [NigeriaStateEnum.DELTA]: ["Aniocha North", "Aniocha South", "Bomadi", "Burutu", "Ethiope East", "Ethiope West", "Ika North East", "Ika South", "Isoko North", "Isoko South", "Ndokwa East", "Ndokwa West", "Okpe", "Oshimili North", "Oshimili South", "Patani", "Sapele", "Udu", "Ughelli North", "Ughelli South", "Ukwuani", "Uvwie", "Warri North", "Warri South", "Warri South West"],
  [NigeriaStateEnum.EBONYI]: ["Abakaliki", "Afikpo North", "Afikpo South (Edda)", "Ebonyi", "Ezza North", "Ezza South", "Ikwo", "Ishielu", "Ivo", "Izzi", "Ohaozara", "Ohaukwu", "Onicha"],
  [NigeriaStateEnum.EDO]: ["Akoko-Edo", "Egor", "Esan Central", "Esan North-East", "Esan South-East", "Esan West", "Etsako Central", "Etsako East", "Etsako West", "Igueben", "Ikpoba Okha", "Oredo", "Orhionmwon", "Ovia North-East", "Ovia South-West", "Owan East", "Owan West", "Uhunmwonde"],
  [NigeriaStateEnum.EKITI]: ["Ado Ekiti", "Efon", "Ekiti East", "Ekiti South-West", "Ekiti West", "Emure", "Gbonyin", "Ido Osi", "Ijero", "Ikere", "Ikole", "Ilejemeje", "Irepodun/Ifelodun", "Ise/Orun", "Moba", "Oye"],
  [NigeriaStateEnum.ENUGU]: ["Aninri", "Awgu", "Enugu East", "Enugu North", "Enugu South", "Ezeagu", "Igbo Etiti", "Igbo Eze North", "Igbo Eze South", "Isi Uzo", "Nkanu East", "Nkanu West", "Nsukka", "Oji River", "Udenu", "Udi", "Uzo Uwani"],
  [NigeriaStateEnum.FCT]: ["Abaji", "Bwari", "Gwagwalada", "Kuje", "Kwali", "Municipal Area Council (AMAC)"],
  [NigeriaStateEnum.GOMBE]: ["Akko", "Balanga", "Billiri", "Dukku", "Funakaye", "Gombe", "Kaltungo", "Kwami", "Nafada", "Shongom", "Yamaltu/Deba"],
  [NigeriaStateEnum.IMO]: ["Aboh Mbaise", "Ahiazu Mbaise", "Ehime Mbano", "Ezinihitte Mbaise", "Ideato North", "Ideato South", "Ihitte/Uboma", "Ikeduru", "Isiala Mbano", "Isu", "Mbaitoli", "Ngor Okpala", "Njaba", "Nkwerre", "Nwangele", "Obowo", "Oguta", "Ohaji/Egbema", "Okigwe", "Orlu", "Orsu", "Oru East", "Oru West", "Owerri Municipal", "Owerri North", "Owerri South"],
  [NigeriaStateEnum.JIGAWA]: ["Auyo", "Babura", "Biriniwa", "Birnin Kudu", "Buji", "Dutse", "Gagarawa", "Garki", "Gumel", "Guri", "Gwaram", "Gwiwa", "Hadejia", "Jahun", "Kafur", "Kaugama", "Kazaure", "Kiri Kasama", "Maigatari", "Malam Madori", "Miga", "Ringim", "Roni", "Sule Tankarkar", "Taura", "Yankwashi"],
  [NigeriaStateEnum.KADUNA]: ["Birnin Gwari", "Chikun", "Giwa", "Kajuru", "Igabi", "Ikara", "Jaba", "Jema'a", "Kachia", "Kaduna North", "Kaduna South", "Kagarko", "Kauru", "Kubau", "Kudan", "Lere", "Makarfi", "Sabon Gari", "Sanga", "Soba", "Zangon Kataf", "Zaria"],
  [NigeriaStateEnum.KANO]: ["Ajingi", "Albasu", "Bagwai", "Bebeji", "Bichi", "Bunkure", "Dala", "Dambatta", "Dawakin Kudu", "Dawakin Tofa", "Doguwa", "Fagge", "Gabasawa", "Garko", "Garun Mallam", "Gaya", "Gezawa", "Gwale", "Gwarzo", "Kabo", "Kano Municipal", "Karaye", "Kibiya", "Kiru", "Kumbotso", "Kunchi", "Kura", "Madobi", "Makoda", "Minjibir", "Nasarawa", "Rano", "Rimin Gado", "Rogo", "Shanono", "Sumaila", "Takai", "Tarauni", "Tofa", "Tsanyawa", "Tudun Wada", "Ungogo", "Warawa", "Wudil"],
  [NigeriaStateEnum.KATSINA]: ["Bakori", "Batagarawa", "Batsari", "Baure", "Bindawa", "Cheranchi", "Dandume", "Danja", "Dan Musa", "Daura", "Dutsin Ma", "Faskari", "Funtua", "Ingawa", "Jibia", "Kafur", "Kaita", "Kankara", "Kankia", "Katsina", "Kurfi", "Kusada", "Mai'Adua", "Malumfashi", "Mani", "Mashi", "Matazu", "Musawa", "Rimi", "Sabuwa", "Safana", "Sandamu", "Zango"],
  [NigeriaStateEnum.KEBBI]: ["Aleiro", "Arewa Dandi", "Argungu", "Augie", "Bagudo", "Birnin Kebbi", "Dandi", "Fakai", "Gwandu", "Jega", "Kalgo", "Koko/Besse", "Maiyama", "Ngaski", "Sakaba", "Shanga", "Suru", "Wasagu/Danko", "Yauri", "Zuru"],
  [NigeriaStateEnum.KOGI]: ["Adavi", "Ajaokuta", "Ankpa", "Bassa", "Dekina", "Ibaji", "Idah", "Igalamela Odolu", "Ijumu", "Kabba/Bunu", "Kogi", "Lokoja", "Mopa Muro", "Ofu", "Ogori/Magongo", "Okehi", "Okene", "Olamaboro", "Omala", "Yagba East", "Yagba West"],
  [NigeriaStateEnum.KWARA]: ["Asa", "Baruten", "Edu", "Ekiti", "Ifelodun", "Ilorin East", "Ilorin South", "Ilorin West", "Irepodun", "Isin", "Kaiama", "Moro", "Offa", "Oke Ero", "Osun", "Pategi"],
  [NigeriaStateEnum.LAGOS]: ["Agege", "Ajeromi-Ifelodun", "Alimosho", "Amuwo-Odofin", "Apapa", "Badagry", "Epe", "Eti-Osa", "Ibeju-Lekki", "Ifako-Ijaiye", "Ikeja", "Ikorodu", "Kosofe", "Lagos Island", "Lagos Mainland", "Mushin", "Ojo", "Oshodi-Isolo", "Shomolu", "Surulere"],
  [NigeriaStateEnum.NASARAWA]: ["Akwanga", "Awe", "Doma", "Karu", "Keana", "Keffi", "Kokona", "Lafia", "Nasarawa", "Nasarawa Egon", "Obi", "Toto", "Wamba"],
  [NigeriaStateEnum.NIGER]: ["Agaie", "Agwara", "Bida", "Borgu", "Bosso", "Chanchaga", "Edati", "Gbako", "Gurara", "Katcha", "Kontagora", "Lapai", "Lavun", "Magama", "Mariga", "Mashegu", "Mokwa", "Moya", "Paikoro", "Rafi", "Rijau", "Shiroro", "Suleja", "Tafa", "Wushishi"],
  [NigeriaStateEnum.OGUN]: ["Abeokuta North", "Abeokuta South", "Ado-Odo/Ota", "Ewekoro", "Ifo", "Ijebu East", "Ijebu North", "Ijebu North East", "Ijebu Ode", "Ikenne", "Imeko Afon", "Ipokia", "Obafemi Owode", "Odeda", "Odogbolu", "Ogun Waterside", "Remo North", "Shagamu", "Yewa North", "Yewa South"],
  [NigeriaStateEnum.ONDO]: ["Akoko North-East", "Akoko North-West", "Akoko South-West", "Akoko South-East", "Akure North", "Akure South", "Ese Odo", "Idanre", "Ifedore", "Ilaje", "Ile Oluji/Okeigbo", "Irele", "Odigbo", "Okitipupa", "Ondo East", "Ondo West", "Ose", "Owo"],
  [NigeriaStateEnum.OSUN]: ["Atakunmosa East", "Atakunmosa West", "Aiyedaade", "Aiyedire", "Boluwaduro", "Boripe", "Ede North", "Ede South", "Ife Central", "Ife East", "Ife North", "Ife South", "Egbedore", "Ejigbo", "Ifedayo", "Ifelodun", "Ila", "Ilesa East", "Ilesa West", "Irepodun", "Irewole", "Isokan", "Iwo", "Obokun", "Odo Otin", "Ola Oluwa", "Olorunda", "Oriade", "Orolu", "Osogbo"],
  [NigeriaStateEnum.OYO]: ["Afijio", "Akinyele", "Atiba", "Atisbo", "Egbeda", "Ibadan North", "Ibadan North-East", "Ibadan North-West", "Ibadan South-East", "Ibadan South-West", "Ibarapa Central", "Ibarapa East", "Ibarapa North", "Ido", "Irepo", "Iseyin", "Itesiwaju", "Iwajowa", "Kajola", "Lagelu", "Ogbomosho North", "Ogbomosho South", "Ogo Oluwa", "Olorunsogo", "Oluyole", "Ona Ara", "Orelope", "Ori Ire", "Oyo East", "Oyo West", "Saki East", "Saki West", "Surulere"],
  [NigeriaStateEnum.PLATEAU]: ["Barkin Ladi", "Bassa", "Bokkos", "Jos East", "Jos North", "Jos South", "Kanam", "Kanke", "Langtang North", "Langtang South", "Mangu", "Mikang", "Pankshin", "Qua'an Pan", "Riyom", "Shendam", "Wase"],
  [NigeriaStateEnum.RIVERS]: ["Abua/Odual", "Ahoada East", "Ahoada West", "Akuku-Toru", "Andoni", "Asari-Toru", "Bonny", "Degema", "Eleme", "Emuoha", "Etche", "Gokana", "Ikwerre", "Khana", "Obio/Akpor", "Ogba/Egbema/Ndoni", "Ogu/Bolo", "Okrika", "Omuma", "Opobo/Nkoro", "Oyigbo", "Port Harcourt", "Tai"],
  [NigeriaStateEnum.SOKOTO]: ["Binji", "Bodinga", "Dange Shuni", "Gada", "Goronyo", "Gudu", "Gwadabawa", "Illela", "Isa", "Kebbe", "Kware", "Rabah", "Sabon Birni", "Shagari", "Silame", "Sokoto North", "Sokoto South", "Tambuwal", "Tangaza", "Tureta", "Wamako", "Wurno", "Yabo"],
  [NigeriaStateEnum.TARABA]: ["Ardo Kola", "Bali", "Donga", "Gashaka", "Gassol", "Ibi", "Jalingo", "Karim Lamido", "Kumi", "Lau", "Sardauna", "Takum", "Ussa", "Wukari", "Yorro", "Zing"],
  [NigeriaStateEnum.YOBE]: ["Bade", "Bursari", "Damaturu", "Fika", "Fune", "Geidam", "Gujba", "Gulani", "Jakusko", "Karasuwa", "Machina", "Nangere", "Nguru", "Potiskum", "Tarmuwa", "Yunusari", "Yusufari"],
  [NigeriaStateEnum.ZAMFARA]: ["Anka", "Bakura", "Birnin Magaji/Kiyaw", "Bukkuyum", "Bungudu", "Gummi", "Gusau", "Kaura Namoda", "Maradun", "Maru", "Shinkafi", "Talata Mafara", "Chafe", "Zurmi"]
};

interface AdminViewListerPortalProps {
  uuid: string;
  isOpen: boolean;
  onClose: () => void;
}

const statusOptions: ComboboxOption[] = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Suspended', value: 'suspended' },
];

const stateOptions: ComboboxOption[] = Object.values(NigeriaStateEnum).map((state) => ({
  label: state,
  value: state,
}));

const emptySubscribe = () => () => {};
function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export default function AdminViewListerPortal({ uuid, isOpen, onClose }: AdminViewListerPortalProps) {
  const dispatch = useAppDispatch();
  const isClient = useIsClient();
  const [animate, setAnimate] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { selectedLister, singleLoading, singleError } = useAppSelector(
    (state) => state.adminLister
  );

  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    date_of_birth: '',
    nationality: '',
    country: '',
    state: '',
    lga: '',
    address: '',
    postal_code: '',
    active_status: 'active',
  });

  const lgaOptions: ComboboxOption[] = useMemo(() => {
    if (!formData.state) return [];
    
    const matchedState = Object.values(NigeriaStateEnum).find(
      (s) => s.toLowerCase() === formData.state.toLowerCase()
    );

    if (!matchedState || !NIGERIA_LGA_MAP[matchedState]) return [];

    return NIGERIA_LGA_MAP[matchedState].map((lga) => ({
      label: lga,
      value: lga,
    }));
  }, [formData.state]);

  useEffect(() => {
    if (selectedLister) {
      queueMicrotask(() => {
        setFormData({
          first_name: selectedLister.first_name || '',
          middle_name: selectedLister.middle_name || '',
          last_name: selectedLister.last_name || '',
          email: selectedLister.email || '',
          phone_number: selectedLister.phone_number || '',
          date_of_birth: selectedLister.date_of_birth || '',
          nationality: selectedLister.nationality || '',
          country: selectedLister.country || '',
          state: selectedLister.state || '',
          lga: selectedLister.lga || '',
          address: selectedLister.address || '',
          postal_code: selectedLister.postal_code || '',
          active_status: selectedLister.active_status || 'active',
        });
      });
    }
  }, [selectedLister]);

  useEffect(() => {
    let animFrameId: number;

    if (isOpen) {
      if (uuid) {
        dispatch(fetchListerByUuid(uuid));
      }
      animFrameId = requestAnimationFrame(() => setAnimate(true));
    } else {
      animFrameId = requestAnimationFrame(() => {
        setAnimate(false);
        setIsEditing(false);
      });
      dispatch(clearSelectedLister());
    }

    return () => {
      if (animFrameId) cancelAnimationFrame(animFrameId);
    };
  }, [dispatch, isOpen, uuid]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleComboboxChange = (name: string, value: string | number | (string | number)[]) => {
    const stringValue = String(value);

    setFormData((prev) => {
      const updated = { ...prev, [name]: stringValue };

      if (name === 'state') {
        const matchedState = Object.values(NigeriaStateEnum).find(
          (s) => s.toLowerCase() === stringValue.toLowerCase()
        );

        if (matchedState && NIGERIA_LGA_MAP[matchedState]) {
          const validLgas = NIGERIA_LGA_MAP[matchedState];
          if (!validLgas.includes(prev.lga)) {
            updated.lga = '';
          }
        } else {
          updated.lga = '';
        }
      }

      return updated;
    });
  };

  const handleSaveSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('Submitting updated lister data:', formData);
    setIsEditing(false);
  };

  if (!isClient || !isOpen) return null;

  const lister: ListerProfile | null = selectedLister;
  const fullName = lister 
    ? [lister.first_name, lister.middle_name, lister.last_name].filter(Boolean).join(' ') 
    : 'Lister Profile';

  const portalContent = (
    <div className="fixed inset-0 z-[9999] flex justify-end">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className={`fixed inset-0 bg-slate-900/20 backdrop-blur-md transition-opacity duration-300 ease-out ${
          animate ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Drawer Panel */}
      <div
        className={`relative z-10 w-full max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 transition-transform duration-300 ease-in-out ${
          animate ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-white">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              Lister Account
            </span>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">
              {isEditing ? 'Edit Lister Details' : fullName}
            </h2>
          </div>
          
          <div className="flex items-center gap-2">
            {!isEditing && lister && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <LuPencil size={13} />
                Edit
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <LuX size={18} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-white">
          {singleLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800" />
              <p className="text-xs font-medium text-slate-400">Fetching lister record...</p>
            </div>
          ) : singleError ? (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs text-center">
              {singleError}
            </div>
          ) : lister ? (
            isEditing ? (
              /* --- EDIT MODE --- */
              <form id="edit-lister-form" onSubmit={handleSaveSubmit} className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100 mb-4">
                    Personal Details
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="outerDiv w-full">
                      <label className="text-xs font-semibold text-slate-600 mb-1 block" htmlFor="first_name">First Name</label>
                      <div className="inputDiv flex items-center border border-slate-200 p-2 rounded gap-2 focus-within:border-slate-800">
                        <LuUser className="text-slate-400 shrink-0" size={16} />
                        <input
                          type="text"
                          id="first_name"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleInputChange}
                          className="w-full text-xs outline-none bg-transparent"
                        />
                      </div>
                    </div>

                    <div className="outerDiv w-full">
                      <label className="text-xs font-semibold text-slate-600 mb-1 block" htmlFor="middle_name">Middle Name</label>
                      <div className="inputDiv flex items-center border border-slate-200 p-2 rounded gap-2 focus-within:border-slate-800">
                        <LuUser className="text-slate-400 shrink-0" size={16} />
                        <input
                          type="text"
                          id="middle_name"
                          name="middle_name"
                          value={formData.middle_name}
                          onChange={handleInputChange}
                          className="w-full text-xs outline-none bg-transparent"
                        />
                      </div>
                    </div>

                    <div className="outerDiv w-full">
                      <label className="text-xs font-semibold text-slate-600 mb-1 block" htmlFor="last_name">Last Name</label>
                      <div className="inputDiv flex items-center border border-slate-200 p-2 rounded gap-2 focus-within:border-slate-800">
                        <LuUser className="text-slate-400 shrink-0" size={16} />
                        <input
                          type="text"
                          id="last_name"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleInputChange}
                          className="w-full text-xs outline-none bg-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100 mb-4">
                    Contact & Demographics
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="outerDiv w-full">
                      <label className="text-xs font-semibold text-slate-600 mb-1 block" htmlFor="email">Email</label>
                      <div className="inputDiv flex items-center border border-slate-200 p-2 rounded gap-2 focus-within:border-slate-800">
                        <LuMail className="text-slate-400 shrink-0" size={16} />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full text-xs outline-none bg-transparent"
                        />
                      </div>
                    </div>

                    <div className="outerDiv w-full">
                      <label className="text-xs font-semibold text-slate-600 mb-1 block" htmlFor="phone_number">Phone Number</label>
                      <div className="inputDiv flex items-center border border-slate-200 p-2 rounded gap-2 focus-within:border-slate-800">
                        <LuPhone className="text-slate-400 shrink-0" size={16} />
                        <input
                          type="text"
                          id="phone_number"
                          name="phone_number"
                          value={formData.phone_number}
                          onChange={handleInputChange}
                          className="w-full text-xs outline-none bg-transparent"
                        />
                      </div>
                    </div>

                    <div className="outerDiv w-full">
                      <label className="text-xs font-semibold text-slate-600 mb-1 block" htmlFor="date_of_birth">Date of Birth</label>
                      <div className="inputDiv flex items-center border border-slate-200 p-2 rounded gap-2 focus-within:border-slate-800">
                        <LuCalendar className="text-slate-400 shrink-0" size={16} />
                        <input
                          type="date"
                          id="date_of_birth"
                          name="date_of_birth"
                          value={formData.date_of_birth}
                          onChange={handleInputChange}
                          className="w-full text-xs outline-none bg-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <Combobox
                        label="Account Status"
                        name="active_status"
                        value={formData.active_status}
                        options={statusOptions}
                        onChange={handleComboboxChange}
                        searchable={false}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100 mb-4">
                    Location & Address
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="outerDiv col-span-2 w-full">
                      <label className="text-xs font-semibold text-slate-600 mb-1 block" htmlFor="address">Address</label>
                      <div className="inputDiv flex items-center border border-slate-200 p-2 rounded gap-2 focus-within:border-slate-800">
                        <LuMapPin className="text-slate-400 shrink-0" size={16} />
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full text-xs outline-none bg-transparent"
                        />
                      </div>
                    </div>

                    {/* State Combobox */}
                    <div>
                      <Combobox
                        label="State"
                        name="state"
                        value={formData.state}
                        options={stateOptions}
                        onChange={handleComboboxChange}
                        placeholder="Select State"
                        searchable={true}
                      />
                    </div>

                    {/* Dynamic LGA Combobox */}
                    <div>
                      <Combobox
                        label="LGA"
                        name="lga"
                        value={formData.lga}
                        options={lgaOptions}
                        onChange={handleComboboxChange}
                        placeholder={formData.state ? 'Select LGA' : 'Select State first'}
                        searchable={true}
                        disabled={!formData.state}
                      />
                    </div>

                    <div className="outerDiv w-full">
                      <label className="text-xs font-semibold text-slate-600 mb-1 block" htmlFor="country">Country</label>
                      <div className="inputDiv flex items-center border border-slate-200 p-2 rounded gap-2 focus-within:border-slate-800">
                        <LuGlobe className="text-slate-400 shrink-0" size={16} />
                        <input
                          type="text"
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="w-full text-xs outline-none bg-transparent"
                        />
                      </div>
                    </div>

                    <div className="outerDiv w-full">
                      <label className="text-xs font-semibold text-slate-600 mb-1 block" htmlFor="nationality">Nationality</label>
                      <div className="inputDiv flex items-center border border-slate-200 p-2 rounded gap-2 focus-within:border-slate-800">
                        <LuFlag className="text-slate-400 shrink-0" size={16} />
                        <input
                          type="text"
                          id="nationality"
                          name="nationality"
                          value={formData.nationality}
                          onChange={handleInputChange}
                          className="w-full text-xs outline-none bg-transparent"
                        />
                      </div>
                    </div>

                    <div className="outerDiv w-full col-span-2">
                      <label className="text-xs font-semibold text-slate-600 mb-1 block" htmlFor="postal_code">Postal Code</label>
                      <div className="inputDiv flex items-center border border-slate-200 p-2 rounded gap-2 focus-within:border-slate-800">
                        <LuHash className="text-slate-400 shrink-0" size={16} />
                        <input
                          type="text"
                          id="postal_code"
                          name="postal_code"
                          value={formData.postal_code}
                          onChange={handleInputChange}
                          className="w-full text-xs outline-none bg-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              /* --- VIEW MODE --- */
              <div className="space-y-6">
                {/* Profile Card Header */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-lg shrink-0">
                    <LuUser size={22} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-slate-900 text-base truncate">{fullName}</h3>
                    <p className="text-xs text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
                      <LuMail size={13} /> {lister.email || '—'}
                    </p>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                    lister.active_status === 'active' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    <LuCheckCheck size={12} />
                    {lister.active_status || 'active'}
                  </span>
                </div>

                {/* Account Identifiers */}
                <div className="pb-4 border-b border-slate-100 space-y-2 text-xs">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block">Account References</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 bg-slate-50/50 rounded-lg border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-medium">Lister UUID</span>
                      <span className="font-mono text-slate-700 font-medium truncate block">{lister.uuid || '—'}</span>
                    </div>
                    <div className="p-2.5 bg-slate-50/50 rounded-lg border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-medium">User UUID</span>
                      <span className="font-mono text-slate-700 font-medium truncate block">{lister.user_uuid || '—'}</span>
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="pb-4 border-b border-slate-100 space-y-3">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block">Personal Info</span>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="flex items-center gap-2.5">
                      <LuPhone className="text-slate-400 shrink-0" size={15} />
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase">Phone Number</p>
                        <p className="font-semibold text-slate-800">{lister.phone_number || '—'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <LuCalendar className="text-slate-400 shrink-0" size={15} />
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase">Date of Birth</p>
                        <p className="font-semibold text-slate-800">{lister.date_of_birth || '—'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <LuGlobe className="text-slate-400 shrink-0" size={15} />
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase">Nationality</p>
                        <p className="font-semibold text-slate-800 capitalize">{lister.nationality || '—'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location Information */}
                <div className="pb-4 border-b border-slate-100 space-y-3">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block">Address & Location</span>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-start gap-2 text-xs">
                      <LuMapPin className="text-slate-400 mt-0.5 shrink-0" size={15} />
                      <div>
                        <p className="font-medium text-slate-800">{lister.address || 'No street address provided'}</p>
                        <p className="text-slate-500 text-[11px]">
                          {[lister.lga, lister.state, lister.country].filter(Boolean).join(', ') || '—'}
                        </p>
                      </div>
                    </div>

                    {lister.postal_code && (
                      <div className="flex items-center gap-2 pl-6 text-slate-500 text-[11px]">
                        <LuHash size={12} />
                        <span>Postal Code: {lister.postal_code}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* System Timestamps */}
                <div className="space-y-3 text-xs">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block">System History</span>
                  <div className="grid grid-cols-2 gap-4 text-slate-500">
                    <div className="flex items-center gap-2">
                      <LuClock size={13} className="text-slate-400" />
                      <div>
                        <p className="text-[10px] text-slate-400">Created At</p>
                        <p className="font-medium text-slate-700">
                          {lister.created_at ? new Date(lister.created_at).toLocaleDateString() : '—'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <LuClock size={13} className="text-slate-400" />
                      <div>
                        <p className="text-[10px] text-slate-400">Updated At</p>
                        <p className="font-medium text-slate-700">
                          {lister.updated_at ? new Date(lister.updated_at).toLocaleDateString() : '—'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">
              No lister record found.
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-md transition-all"
              >
                <LuArrowLeft size={14} />
                Cancel
              </button>
              <button
                type="submit"
                form="edit-lister-form"
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-md transition-all shadow-sm"
              >
                <LuSave size={14} />
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-md transition-all"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(portalContent, document.body);
}