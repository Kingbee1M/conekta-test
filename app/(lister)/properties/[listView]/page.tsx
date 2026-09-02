'use client';

import { use, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import {
  useGetListingByUuidQuery,
  UpdateListingPayload,
  useUpdateListingByUuidMutation,
  useDeleteListingByUuidMutation,
} from '@/shared/service/listing.services';

import { useUploadMediaMutation } from '@/shared/service/media.services';
import DeleteListingPortal from '@/app/components/ui/DeleteListingPortal';

import { PaymentFrequencyEnum } from '@/shared/enums/paymentFreqency.enums';
import { AmenitiesEnum } from '@/shared/enums/amenities.enums';
import { FeeTypeEnum } from '@/shared/enums/feeType.enums';
import { MediaType } from '@/shared/enums/media-type.enum';

import {
  FiArrowLeft,
  FiMapPin,
  FiHome,
  FiLayers,
  FiCheckCircle,
  FiAlertCircle,
  FiEdit3,
  FiMoreHorizontal,
  FiCalendar,
  FiShield,
  FiCopy,
  FiSave,
  FiX,
  FiPlus,
  FiTrash2,
  FiStar,
  FiUploadCloud,
  FiImage,
  FiLoader,
  FiChevronDown,
  FiCheck,
} from 'react-icons/fi';

import { BiBed, BiBath } from 'react-icons/bi';

interface PageProps {
  params: Promise<{ listView: string }>;
}

interface EditableSectionProps {
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
  editing: boolean;
  saving?: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  disabled?: boolean;
}

interface LocalImage {
  id: string;
  url: string;
  is_primary: boolean;
}

interface FeeItem {
  fee: number;
  frequency: PaymentFrequencyEnum;
  fee_type: FeeTypeEnum;
}

const PAYMENT_FREQUENCIES = Object.values(PaymentFrequencyEnum);
const AMENITY_OPTIONS = Object.values(AmenitiesEnum);
const FEE_TYPES = Object.values(FeeTypeEnum);

/* ============================================================
   EDITABLE SECTION
============================================================ */

function EditableSection({
  eyebrow,
  title,
  children,
  editing,
  saving = false,
  onEdit,
  onSave,
  onCancel,
  disabled = false,
}: EditableSectionProps) {
  return (
    <section className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden mb-7">
      <div className="px-5 sm:px-6 py-5 border-b border-gray-100">
        <div className="flex items-center justify-between gap-4">
          <div>
            {eyebrow && (
              <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-primary-green">
                {eyebrow}
              </p>
            )}

            <h2 className="text-lg font-bold text-gray-950 mt-1">{title}</h2>
          </div>

          {!editing && (
            <button
              type="button"
              onClick={onEdit}
              disabled={disabled}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-600 hover:border-gray-300 hover:text-gray-900 hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              <FiEdit3 />
              Edit
            </button>
          )}

          {editing && (
            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              className="w-9 h-9 rounded-xl border border-gray-200 text-gray-500 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50"
              aria-label={`Cancel editing ${title}`}
            >
              <FiX />
            </button>
          )}
        </div>
      </div>

      <div className="px-5 sm:px-6 py-5">{children}</div>

      {editing && (
        <div className="px-5 sm:px-6 py-4 border-t border-gray-100 bg-gray-50/60 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="h-10 px-4 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="h-10 px-4 rounded-xl bg-primary-green text-white text-xs font-semibold inline-flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {saving ? (
              <>
                <FiLoader className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <FiSave />
                Save changes
              </>
            )}
          </button>
        </div>
      )}
    </section>
  );
}

/* ============================================================
   INPUT HELPERS
============================================================ */

function InputField({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-gray-600 mb-2">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-11 px-3.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 outline-none focus:border-primary-green focus:ring-4 focus:ring-primary-green/5 transition-all"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-gray-600 mb-2">
        {label}
      </span>

      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none w-full h-11 pl-3.5 pr-10 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 outline-none focus:border-primary-green focus:ring-4 focus:ring-primary-green/5 transition-all capitalize"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option.replace(/_/g, ' ')}
            </option>
          ))}
        </select>

        <FiChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>
    </label>
  );
}

/* ============================================================
   MAIN PAGE
============================================================ */

export default function PropertyDetailView({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const propertyUuid = resolvedParams.listView;

  const { data, isLoading, isError } = useGetListingByUuidQuery(propertyUuid, {
    skip: !propertyUuid,
    refetchOnMountOrArgChange: true,
  });

  const propertyData = data?.data ?? null;

  const [updateListing, { isLoading: isUpdating }] =
    useUpdateListingByUuidMutation();
  const [deleteListing, { isLoading: isDeleting }] =
    useDeleteListingByUuidMutation();

  const [uploadMedia] = useUploadMediaMutation();

  /* ========================================================
     EDITING STATES
  ======================================================== */

  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  /* Description */
  const [description, setDescription] = useState('');

  /* Location */
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [lga, setLga] = useState('');

  /* Property details */
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [toilets, setToilets] = useState('');
  const [parkingSpaces, setParkingSpaces] = useState('');
  const [structure, setStructure] = useState('');
  const [squareMeters, setSquareMeters] = useState('');

  /* Pricing */
  const [basePrice, setBasePrice] = useState('');
  const [paymentFrequency, setPaymentFrequency] =
    useState<PaymentFrequencyEnum>(PaymentFrequencyEnum.MONTHLY);

  /* Amenities */
  const [selectedAmenities, setSelectedAmenities] = useState<
    AmenitiesEnum[]
  >([]);

  /* Fees */
  const [fees, setFees] = useState<FeeItem[]>([]);

  /* Images */
  const [localImages, setLocalImages] = useState<LocalImage[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  /* ========================================================
     INITIAL VALUES
  ======================================================== */

  const startEditing = (section: string) => {
    if (!propertyData) return;

    setSaveError(null);
    setSaveSuccess(null);

    if (section === 'description') {
      setDescription(propertyData.description || '');
    }

    if (section === 'location') {
      setStreet(propertyData.location?.street || propertyData.street || '');
      setCity(propertyData.location?.city || propertyData.city || '');
      setStateName(propertyData.location?.state || propertyData.state || '');
      setLga(propertyData.location?.lga || propertyData.lga || '');
    }

    if (section === 'details') {
      setBedrooms(String(propertyData.property_info?.bedrooms ?? ''));
      setBathrooms(String(propertyData.property_info?.bathrooms ?? ''));
      setToilets(String(propertyData.property_info?.toilets ?? ''));
      setParkingSpaces(
        String(propertyData.property_info?.parking_spaces ?? '')
      );
      setStructure(
        propertyData.property_info?.structure || propertyData.structure || ''
      );
      setSquareMeters(
        String(propertyData.property_info?.square_meters ?? '')
      );
    }

    if (section === 'pricing') {
      setBasePrice(String(propertyData.base_price ?? ''));
      setPaymentFrequency(
        (propertyData.payment_frequency as PaymentFrequencyEnum) ||
          PaymentFrequencyEnum.MONTHLY
      );
    }

    if (section === 'amenities') {
      setSelectedAmenities([
        ...((propertyData.amenities || []) as AmenitiesEnum[]),
      ]);
    }

    if (section === 'fees') {
      setFees(
        [...(propertyData.fees || [])].map((fee) => ({
          fee: Number(fee.fee) || 0,
          frequency: fee.frequency as PaymentFrequencyEnum,
          fee_type: fee.fee_type as FeeTypeEnum,
        }))
      );
    }

    if (section === 'images') {
      setLocalImages(
        (propertyData.media || []).map((media) => ({
          id: media.id,
          url: media.url,
          is_primary: Boolean(media.is_primary),
        }))
      );
    }

    setEditingSection(section);
  };

  const stopEditing = () => {
    if (isUpdating || uploadingImages) return;
    setEditingSection(null);
    setSaveError(null);
  };

  /* ========================================================
     PATCH HELPER
  ======================================================== */

  const patchListing = async (
    section: string,
    payload: UpdateListingPayload
  ) => {
    try {
      setSaveError(null);
      setSaveSuccess(null);

      await updateListing({
        uuid: propertyUuid,
        payload,
      }).unwrap();

      setEditingSection(null);
      setSaveSuccess(`${section} updated successfully.`);

      window.setTimeout(() => {
        setSaveSuccess(null);
      }, 2500);
    } catch (error) {
      console.error(`Failed to update ${section}:`, error);
      setSaveError(`Unable to update ${section}. Please try again.`);
    }
  };

  /* ========================================================
     SAVERS
  ======================================================== */

  const saveDescription = () => {
    patchListing('Description', { description });
  };

  const saveLocation = () => {
    patchListing('Location', {
      street,
      city,
      state: stateName,
      lga,
    });
  };

  const saveDetails = () => {
    patchListing('Property details', {
      bedrooms: bedrooms === '' ? undefined : Number(bedrooms),
      bathrooms: bathrooms === '' ? undefined : Number(bathrooms),
      toilets: toilets === '' ? undefined : Number(toilets),
      parking_spaces: parkingSpaces === '' ? undefined : Number(parkingSpaces),
      structure,
      square_meters: squareMeters === '' ? undefined : squareMeters,
    });
  };

  const savePricing = () => {
    patchListing('Pricing', {
      base_price: Number(basePrice),
      payment_frequency: paymentFrequency,
    });
  };

  const saveAmenities = () => {
    patchListing('Amenities', {
      amenities: selectedAmenities,
    });
  };

  const saveFees = () => {
    patchListing('Fees', {
      fees,
    });
  };

  /* ========================================================
     IMAGE HANDLERS
  ======================================================== */

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    try {
      setUploadingImages(true);
      setSaveError(null);

      const uploadedImages: LocalImage[] = [];

      for (const file of files) {
        const response = await uploadMedia({
          file,
          media_type: MediaType.IMAGE,
        }).unwrap();

        const uploaded = response.data;
        if (!uploaded) {
          throw new Error('Media upload returned no data');
        }

        uploadedImages.push({
          id: uploaded.id,
          url: uploaded.url,
          is_primary: false,
        });
      }

      setLocalImages((current) => [...current, ...uploadedImages]);
    } catch (error) {
      console.error('Failed to upload images:', error);
      setSaveError('One or more images could not be uploaded. Please try again.');
    } finally {
      setUploadingImages(false);
      event.target.value = '';
    }
  };

  const removeImage = (id: string) => {
    setLocalImages((current) => {
      const remaining = current.filter((image) => image.id !== id);
      if (remaining.length > 0 && !remaining.some((image) => image.is_primary)) {
        remaining[0].is_primary = true;
      }
      return remaining;
    });
  };

  const makePrimary = (id: string) => {
    setLocalImages((current) =>
      current.map((image) => ({
        ...image,
        is_primary: image.id === id,
      }))
    );
  };

  const saveImages = () => {
    const primaryIndex = localImages.findIndex((image) => image.is_primary);

    patchListing('Photos', {
      images: localImages.map((image) => image.id),
      primary_image_index: primaryIndex >= 0 ? primaryIndex : 0,
    });
  };

  /* ========================================================
     FEE & AMENITY HELPERS
  ======================================================== */

  const addFee = () => {
    setFees((current) => [
      ...current,
      {
        fee: 0,
        frequency:
          (propertyData?.payment_frequency as PaymentFrequencyEnum) ||
          PaymentFrequencyEnum.MONTHLY,
        fee_type: FEE_TYPES[0] as FeeTypeEnum,
      },
    ]);
  };

  const removeFee = (index: number) => {
    setFees((current) => current.filter((_, feeIndex) => feeIndex !== index));
  };

  const toggleAmenity = (amenity: AmenitiesEnum) => {
    setSelectedAmenities((current) =>
      current.includes(amenity)
        ? current.filter((item) => item !== amenity)
        : [...current, amenity]
    );
  };

  const handleCopyRef = async () => {
    if (!propertyData?.ref_no) return;
    try {
      await navigator.clipboard.writeText(propertyData.ref_no);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy ref code', err);
    }
  };

  const handleDeleteListing = async () => {
    try {
      setSaveError(null);
      await deleteListing(propertyUuid).unwrap();
      router.replace('/properties');
    } catch (error) {
      console.error('Failed to delete listing:', error);
      setIsDeleteModalOpen(false);
      setSaveError('Unable to delete this listing. Please try again.');
    }
  };

  /* ========================================================
     CURRENCY
  ======================================================== */

  const formatCurrency = (val?: string | number) => {
    if (val === undefined || val === null) return '—';
    const num = Number(val);

    return isNaN(num)
      ? String(val)
      : new Intl.NumberFormat('en-NG', {
          style: 'currency',
          currency: propertyData?.currency || 'NGN',
          maximumFractionDigits: 0,
        }).format(num);
  };

  /* ========================================================
     DERIVED VALUES
  ======================================================== */

  const secondaryImages = useMemo(
    () => propertyData?.media?.filter((media) => !media.is_primary) || [],
    [propertyData?.media]
  );

  const primaryImage =
    propertyData?.media?.find((media) => media.is_primary) ||
    propertyData?.media?.[0];

  const totalPhotos = propertyData?.media?.length || 0;

  const locationText = [
    propertyData?.location?.street || propertyData?.street,
    propertyData?.location?.city || propertyData?.city,
    propertyData?.location?.state || propertyData?.state,
  ]
    .filter(Boolean)
    .join(', ');

  const isActive = propertyData?.listing_status === 'active';

  /* ========================================================
     LOADING
  ======================================================== */

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#f8f9f8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-10 w-40 bg-gray-200 rounded-xl" />
            <div className="space-y-3">
              <div className="h-7 w-24 bg-gray-200 rounded-full" />
              <div className="h-12 w-2/3 bg-gray-200 rounded-xl" />
              <div className="h-4 w-1/3 bg-gray-200 rounded" />
            </div>
            <div className="grid grid-cols-12 gap-3 h-[450px]">
              <div className="col-span-8 bg-gray-200 rounded-2xl" />
              <div className="col-span-4 grid grid-rows-2 gap-3">
                <div className="bg-gray-200 rounded-2xl" />
                <div className="bg-gray-200 rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* ========================================================
     ERROR
  ======================================================== */

  if (isError || !propertyData) {
    return (
      <div className="min-h-[60vh] bg-[#fafafa] flex items-center justify-center px-5">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 mb-5">
            <FiAlertCircle className="text-2xl" />
          </div>

          <h3 className="text-2xl font-bold text-gray-900">
            Listing not found
          </h3>

          <p className="text-sm text-gray-500 mt-2 leading-relaxed">
            We couldn&apos;t find the listing you&apos;re looking for. It may
            have been removed or is no longer available.
          </p>

          <Link
            href="/properties"
            className="inline-flex items-center gap-2 mt-6 px-5 py-3 rounded-xl bg-primary-green text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <FiArrowLeft />
            Back to my properties
          </Link>
        </div>
      </div>
    );
  }

  /* ========================================================
     PAGE
  ======================================================== */

  return (
    <main className="min-h-screen bg-[#f8f9f8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* TOP NAV */}
        <div className="flex items-center justify-between mb-7">
          <Link
            href="/properties"
            className="group inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-white border border-gray-200 group-hover:border-gray-300 shadow-sm">
              <FiArrowLeft />
            </span>
            <span className="hidden sm:block">My properties</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(true)}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-red-600 text-white text-xs sm:text-sm font-semibold shadow-sm hover:bg-red-700 transition-colors"
            >
              <FiTrash2 />
              Delete listing
            </button>

            <button
              type="button"
              className="w-10 h-10 rounded-xl bg-white border border-gray-200 text-gray-500 flex items-center justify-center hover:text-gray-900 hover:border-gray-300 transition-colors"
            >
              <FiMoreHorizontal />
            </button>
          </div>
        </div>

        <DeleteListingPortal
          isOpen={isDeleteModalOpen}
          listingTitle={propertyData.title}
          isDeleting={isDeleting}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteListing}
        />

        {/* FEEDBACK */}
        {saveError && (
          <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
            <FiAlertCircle />
            {saveError}
          </div>
        )}

        {saveSuccess && (
          <div className="mb-5 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 flex items-center gap-2">
            <FiCheckCircle />
            {saveSuccess}
          </div>
        )}

        {/* HEADER */}
        <section className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isActive ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                  />
                  {propertyData.listing_status || 'Draft'}
                </span>

                <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider">
                  For {propertyData.purpose || 'N/A'}
                </span>

                {propertyData.verification_status && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider">
                    <FiShield />
                    {propertyData.verification_status}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight leading-[1.1] text-gray-950 max-w-4xl">
                {propertyData.title || 'Untitled Property'}
              </h1>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-3 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <FiMapPin className="text-primary-green" />
                  {locationText || 'Location unavailable'}
                </span>

                <span className="hidden sm:block text-gray-300">•</span>

                <span>
                  Reference:{' '}
                  <span className="font-mono font-medium text-gray-700">
                    {propertyData.ref_no || 'N/A'}
                  </span>
                </span>
              </div>
            </div>

            <div className="shrink-0 lg:text-right">
              <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-gray-400">
                Listing price
              </p>

              <div className="flex items-baseline lg:justify-end gap-1.5 mt-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-primary-green tracking-tight">
                  {formatCurrency(propertyData.base_price)}
                </span>

                <span className="text-xs text-gray-400 font-medium capitalize">
                  / {propertyData.payment_frequency?.replace(/_/g, ' ') || 'period'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* PHOTOS */}
        <EditableSection
          eyebrow="Listing media"
          title="Photos"
          editing={editingSection === 'images'}
          saving={isUpdating || uploadingImages}
          onEdit={() => startEditing('images')}
          onSave={saveImages}
          onCancel={stopEditing}
        >
          {editingSection === 'images' ? (
            <div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {localImages.map((image) => (
                  <div
                    key={image.id}
                    className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 group"
                  >
                    <Image
                      fill
                      src={image.url}
                      alt="Listing photo"
                      className="object-cover"
                      sizes="300px"
                    />

                    {image.is_primary && (
                      <div className="absolute left-2 top-2 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-primary-green text-white text-[10px] font-bold">
                        <FiStar />
                        Primary
                      </div>
                    )}

                    <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/70 to-transparent pt-8 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex gap-1.5">
                        {!image.is_primary && (
                          <button
                            type="button"
                            onClick={() => makePrimary(image.id)}
                            className="flex-1 h-8 rounded-lg bg-white/95 text-gray-800 text-[10px] font-semibold flex items-center justify-center gap-1"
                          >
                            <FiStar />
                            Primary
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => removeImage(image.id)}
                          className="w-8 h-8 rounded-lg bg-red-500 text-white flex items-center justify-center"
                          aria-label="Remove image"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <label className="aspect-[4/3] rounded-xl border-2 border-dashed border-gray-200 hover:border-primary-green hover:bg-primary-green/[0.02] flex flex-col items-center justify-center cursor-pointer transition-all">
                  {uploadingImages ? (
                    <FiLoader className="text-xl text-primary-green animate-spin" />
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-xl bg-primary-green/8 text-primary-green flex items-center justify-center mb-2">
                        <FiUploadCloud />
                      </div>

                      <span className="text-xs font-semibold text-gray-700">
                        Add photos
                      </span>

                      <span className="text-[10px] text-gray-400 mt-1">
                        JPG, PNG or WEBP
                      </span>
                    </>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadingImages}
                  />
                </label>
              </div>

              <p className="text-xs text-gray-400 mt-4">
                Upload new photos, remove existing ones, or select a photo as
                the primary image.
              </p>
            </div>
          ) : (
            <div>
              {propertyData.media && propertyData.media.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 h-[350px] sm:h-[440px]">
                  <div className="relative md:col-span-8 overflow-hidden rounded-2xl bg-gray-200 group">
                    {primaryImage && (
                      <Image
                        fill
                        priority
                        src={primaryImage.url}
                        alt={propertyData.title || 'Property Cover'}
                        className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, 66vw"
                      />
                    )}

                    <div className="absolute left-5 bottom-5">
                      <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-black/40 backdrop-blur-md text-white">
                        <FiStar />
                        <span className="text-xs font-semibold">
                          Property cover
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="hidden md:grid md:col-span-4 grid-rows-2 gap-2.5">
                    {[0, 1].map((index) => {
                      const img = secondaryImages[index];

                      return (
                        <div
                          key={index}
                          className="relative overflow-hidden rounded-2xl bg-gray-200"
                        >
                          {img ? (
                            <Image
                              fill
                              src={img.url}
                              alt={`${propertyData.title || 'Property'} image ${
                                index + 2
                              }`}
                              className="object-cover"
                              sizes="34vw"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                              <FiImage className="text-2xl" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="py-12 rounded-xl border border-dashed border-gray-200 flex flex-col items-center justify-center">
                  <FiImage className="text-3xl text-gray-300 mb-2" />
                  <p className="text-sm font-semibold text-gray-600">
                    No photos added
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Add photos to make your listing more attractive.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between mt-3">
                <p className="text-xs text-gray-400">
                  {totalPhotos} {totalPhotos === 1 ? 'photo' : 'photos'} in this
                  listing
                </p>
              </div>
            </div>
          )}
        </EditableSection>

        {/* MAIN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-9 items-start">
          <div className="lg:col-span-8">
            {/* PROPERTY DETAILS */}
            <EditableSection
              eyebrow="Property information"
              title="Property details"
              editing={editingSection === 'details'}
              saving={isUpdating}
              onEdit={() => startEditing('details')}
              onSave={saveDetails}
              onCancel={stopEditing}
            >
              {editingSection === 'details' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    label="Bedrooms"
                    type="number"
                    value={bedrooms}
                    onChange={setBedrooms}
                  />

                  <InputField
                    label="Bathrooms"
                    type="number"
                    value={bathrooms}
                    onChange={setBathrooms}
                  />

                  <InputField
                    label="Toilets"
                    type="number"
                    value={toilets}
                    onChange={setToilets}
                  />

                  <InputField
                    label="Parking spaces"
                    type="number"
                    value={parkingSpaces}
                    onChange={setParkingSpaces}
                  />

                  <InputField
                    label="Structure"
                    value={structure}
                    onChange={setStructure}
                    placeholder="e.g. Detached duplex"
                  />

                  <InputField
                    label="Square meters"
                    value={squareMeters}
                    onChange={setSquareMeters}
                    placeholder="e.g. 450"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 border border-gray-100 rounded-xl overflow-hidden">
                  <DetailItem
                    icon={<BiBed />}
                    value={propertyData.property_info?.bedrooms ?? 0}
                    label="Bedrooms"
                  />

                  <DetailItem
                    icon={<BiBath />}
                    value={propertyData.property_info?.bathrooms ?? 0}
                    label="Bathrooms"
                  />

                  <DetailItem
                    icon={<FiHome />}
                    value={
                      propertyData.property_info?.structure ||
                      propertyData.structure ||
                      'Standard'
                    }
                    label="Structure"
                  />

                  <DetailItem
                    icon={<FiLayers />}
                    value={
                      propertyData.property_info?.square_meters
                        ? `${propertyData.property_info.square_meters} m²`
                        : '—'
                    }
                    label="Area"
                  />
                </div>
              )}
            </EditableSection>

            {/* DESCRIPTION */}
            <EditableSection
              eyebrow="Listing content"
              title="Description"
              editing={editingSection === 'description'}
              saving={isUpdating}
              onEdit={() => startEditing('description')}
              onSave={saveDescription}
              onCancel={stopEditing}
            >
              {editingSection === 'description' ? (
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={8}
                  className="w-full p-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 leading-7 outline-none resize-y focus:border-primary-green focus:ring-4 focus:ring-primary-green/5 transition-all"
                  placeholder="Describe your property..."
                />
              ) : (
                <div className="text-sm sm:text-[15px] leading-7 text-gray-600 whitespace-pre-line">
                  {propertyData.description ||
                    'No description has been added to this listing yet.'}
                </div>
              )}
            </EditableSection>

            {/* LOCATION */}
            <EditableSection
              eyebrow="Property address"
              title="Location"
              editing={editingSection === 'location'}
              saving={isUpdating}
              onEdit={() => startEditing('location')}
              onSave={saveLocation}
              onCancel={stopEditing}
            >
              {editingSection === 'location' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <InputField
                      label="Street"
                      value={street}
                      onChange={setStreet}
                    />
                  </div>

                  <InputField label="City" value={city} onChange={setCity} />

                  <InputField
                    label="State"
                    value={stateName}
                    onChange={setStateName}
                  />

                  <InputField label="LGA" value={lga} onChange={setLga} />
                </div>
              ) : (
                <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 shrink-0 rounded-lg bg-primary-green/8 text-primary-green flex items-center justify-center">
                      <FiMapPin />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {propertyData.location?.street ||
                          propertyData.street ||
                          'Street not specified'}
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        {propertyData.location?.city ||
                          propertyData.city ||
                          'City'}
                        ,{' '}
                        {propertyData.location?.state ||
                          propertyData.state ||
                          'State'}
                      </p>

                      {(propertyData.location?.lga || propertyData.lga) && (
                        <p className="text-xs text-gray-400 mt-1">
                          {propertyData.location?.lga || propertyData.lga} LGA
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </EditableSection>

            {/* AMENITIES */}
            <EditableSection
              eyebrow="Property features"
              title="Amenities"
              editing={editingSection === 'amenities'}
              saving={isUpdating}
              onEdit={() => startEditing('amenities')}
              onSave={saveAmenities}
              onCancel={stopEditing}
            >
              {editingSection === 'amenities' ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {AMENITY_OPTIONS.map((amenity) => {
                    const selected = selectedAmenities.includes(amenity);

                    return (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => toggleAmenity(amenity)}
                        className={`min-h-11 px-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                          selected
                            ? 'border-primary-green bg-primary-green/5 text-primary-green'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span
                            className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                              selected
                                ? 'bg-primary-green border-primary-green text-white'
                                : 'border-gray-300'
                            }`}
                          >
                            {selected && (
                              <FiCheckCircle className="text-[11px]" />
                            )}
                          </span>

                          {String(amenity).replace(/_/g, ' ')}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div>
                  {propertyData.amenities && propertyData.amenities.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {propertyData.amenities.map((amenity) => (
                        <span
                          key={String(amenity)}
                          className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-100 text-xs font-medium text-gray-600 capitalize"
                        >
                          {String(amenity).replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">
                      No amenities have been added.
                    </p>
                  )}
                </div>
              )}
            </EditableSection>

            {/* FEES */}
            <EditableSection
              eyebrow="Additional charges"
              title="Fees"
              editing={editingSection === 'fees'}
              saving={isUpdating}
              onEdit={() => startEditing('fees')}
              onSave={saveFees}
              onCancel={stopEditing}
            >
              {editingSection === 'fees' ? (
                <div className="space-y-4">
                  {fees.map((fee, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-gray-100 bg-gray-50/60 p-4"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <InputField
                          label="Amount"
                          type="number"
                          value={fee.fee}
                          onChange={(value) => {
                            setFees((current) =>
                              current.map((item, feeIndex) =>
                                feeIndex === index
                                  ? { ...item, fee: Number(value) }
                                  : item
                              )
                            );
                          }}
                        />

                        <SelectField
                          label="Fee type"
                          value={fee.fee_type}
                          onChange={(value) => {
                            setFees((current) =>
                              current.map((item, feeIndex) =>
                                feeIndex === index
                                  ? {
                                      ...item,
                                      fee_type: value as FeeTypeEnum,
                                    }
                                  : item
                              )
                            );
                          }}
                          options={FEE_TYPES}
                        />

                        <div className="flex items-end gap-2">
                          <div className="flex-1">
                            <SelectField
                              label="Frequency"
                              value={fee.frequency}
                              onChange={(value) => {
                                setFees((current) =>
                                  current.map((item, feeIndex) =>
                                    feeIndex === index
                                      ? {
                                          ...item,
                                          frequency:
                                            value as PaymentFrequencyEnum,
                                        }
                                      : item
                                  )
                                );
                              }}
                              options={PAYMENT_FREQUENCIES}
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFee(index)}
                            className="w-11 h-11 rounded-xl border border-red-100 bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addFee}
                    className="w-full h-11 rounded-xl border border-dashed border-gray-200 text-xs font-semibold text-gray-500 hover:border-primary-green hover:text-primary-green hover:bg-primary-green/[0.02] transition-all flex items-center justify-center gap-2"
                  >
                    <FiPlus />
                    Add fee
                  </button>
                </div>
              ) : (
                <div>
                  {propertyData.fees && propertyData.fees.length > 0 ? (
                    <div className="space-y-3">
                      {propertyData.fees.map((fee, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between gap-4"
                        >
                          <div>
                            <p className="text-xs font-semibold text-gray-700 capitalize">
                              {fee.fee_type?.replace(/_/g, ' ')}
                            </p>

                            <p className="text-[10px] text-gray-400 mt-0.5 capitalize">
                              {fee.frequency?.replace(/_/g, ' ')}
                            </p>
                          </div>

                          <p className="text-sm font-bold text-gray-900 whitespace-nowrap">
                            {formatCurrency(fee.fee)}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">
                      No additional fees have been added.
                    </p>
                  )}
                </div>
              )}
            </EditableSection>
          </div>

          {/* SIDEBAR */}
          <aside className="lg:col-span-4 lg:sticky lg:top-6">
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
              {/* PRICE */}
              <div className="px-5 sm:px-6 py-5 border-b border-gray-100">
                <p className="text-xs font-medium text-gray-400">Listed price</p>

                {editingSection === 'pricing' ? (
                  <div className="mt-4 space-y-4">
                    <InputField
                      label="Base price"
                      type="number"
                      value={basePrice}
                      onChange={setBasePrice}
                    />

                    <SelectField
                      label="Payment frequency"
                      value={paymentFrequency}
                      onChange={(value) =>
                        setPaymentFrequency(value as PaymentFrequencyEnum)
                      }
                      options={PAYMENT_FREQUENCIES}
                    />

                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={stopEditing}
                        disabled={isUpdating}
                        className="flex-1 h-10 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={savePricing}
                        disabled={isUpdating}
                        className="flex-1 h-10 rounded-xl bg-primary-green text-white text-xs font-semibold flex items-center justify-center gap-2"
                      >
                        {isUpdating ? (
                          <FiLoader className="animate-spin" />
                        ) : (
                          <FiSave />
                        )}
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3 mt-1">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl sm:text-3xl font-extrabold text-primary-green tracking-tight">
                          {formatCurrency(propertyData.base_price)}
                        </span>

                        <span className="text-xs text-gray-400 font-medium capitalize">
                          / {propertyData.payment_frequency?.replace(/_/g, ' ') || 'period'}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => startEditing('pricing')}
                      className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:text-primary-green hover:border-primary-green transition-colors"
                    >
                      <FiEdit3 />
                    </button>
                  </div>
                )}
              </div>

              {/* DETAILS */}
              <div className="border-b border-gray-100">
                <SidebarRow
                  label="Listing status"
                  value={propertyData.listing_status || 'Draft'}
                  valueClass={
                    isActive ? 'text-emerald-600' : 'text-amber-600'
                  }
                />

                <SidebarRow label="Purpose" value={propertyData.purpose || 'N/A'} />

                <SidebarRow
                  label="Property type"
                  value={propertyData.property_type || 'N/A'}
                />

                <SidebarRow
                  label="Category"
                  value={propertyData.category || 'N/A'}
                />

                <SidebarRow
                  label="Verification"
                  value={propertyData.verification_status || 'Pending'}
                />
              </div>

              {/* MANAGEMENT */}
              <div className="px-5 sm:px-6 py-5">
                <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-gray-400 mb-3">
                  Management
                </p>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => startEditing('description')}
                    className="w-full h-10 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2"
                  >
                    <FiEdit3 />
                    Edit description
                  </button>

                  <button
                    type="button"
                    onClick={() => startEditing('images')}
                    className="w-full h-10 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2"
                  >
                    <FiImage />
                    Manage photos
                  </button>
                </div>
              </div>
            </div>

            {/* REFERENCE CARD */}
            <div className="mt-4 px-1 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[11px] text-gray-400">
                <FiCalendar />
                <span>Listing reference</span>
              </div>

              <button
                type="button"
                onClick={handleCopyRef}
                disabled={!propertyData.ref_no}
                className="flex items-center gap-1.5 text-[11px] font-mono font-medium text-gray-600 hover:text-primary-green transition-colors disabled:opacity-50"
              >
                {propertyData.ref_no || 'N/A'}
                {copied ? (
                  <FiCheck className="text-emerald-500" />
                ) : (
                  <FiCopy className="text-gray-300" />
                )}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

/* ============================================================
   HELPERS
============================================================ */

function DetailItem({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: React.ReactNode;
  label: string;
}) {
  return (
    <div className="p-4 sm:p-5 border-r border-b sm:border-b-0 border-gray-100 last:border-r-0">
      <div className="w-9 h-9 rounded-lg bg-primary-green/8 text-primary-green flex items-center justify-center mb-3">
        {icon}
      </div>

      <p className="text-xl font-bold text-gray-900 capitalize">{value}</p>

      <p className="text-xs text-gray-400 mt-0.5">{label}</p>
    </div>
  );
}

function SidebarRow({
  label,
  value,
  valueClass = 'text-gray-800',
}: {
  label: string;
  value: React.ReactNode;
  valueClass?: string;
}) {
  return (
    <div className="px-5 sm:px-6 py-4 border-b border-gray-50 last:border-b-0 flex items-center justify-between gap-4">
      <span className="text-xs text-gray-500">{label}</span>

      <span
        className={`text-xs font-semibold capitalize text-right ${valueClass}`}
      >
        {value}
      </span>
    </div>
  );
}