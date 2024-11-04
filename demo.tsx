import { Input, Select, Space, Tag } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useGetFacilitiesQuery } from "../redux/api/facility/facility";
import { useGetAllLicenseTypeQuery } from "../redux/api/licensetype/licensetype";
import { useLazyGetAllProvidersQuery } from "../redux/api/provider/provider";
import { debounce } from "lodash";

const StatusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];
export default function useProviderFilter() {
  const [selectedFilterkey, setSelectedFilterkey] = useState<string>("name");
  const [providerNameFiltervalue, setProviderNameFiltervalue] = useState<
    string | undefined
  >(undefined);
  const [emailQueryFilterValue, setEmailQueryFilterValue] = useState<
    string | undefined
  >(undefined);
  const [statusQueryFilterValue, setStatusQueryFilterValue] = useState<
    string | undefined
  >(undefined);
  const [facilityNameQueryFilterValue, setFacilityNameQueryFilterValue] =
    useState<string | undefined>(undefined);
  const [sortingDetails, setSortingDetails] = useState<{
    sortingField?: string;
    isDescending?: boolean;
  }>({ sortingField: "lastName", isDescending: false });
  const [licenseTypeNameQueryFilterValue, setLicenseTypeNameQueryFilterValue] =
    useState<string | undefined>(undefined);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageNumber, setPageNumber] = useState<number>(0);
  const { data: facilities, isLoading: facilitiesLoading } =
    useGetFacilitiesQuery();
  const { data: licenseTypes, isLoading: licenseTypesLoading } =
    useGetAllLicenseTypeQuery();

  const [
    trigger,
    { data: providersData, isLoading: providersLoading, isFetching },
  ] = useLazyGetAllProvidersQuery({});

  useEffect(() => {
    setPageNumber(0);
  }, [
    providerNameFiltervalue,
    emailQueryFilterValue,
    statusQueryFilterValue,
    facilityNameQueryFilterValue,
    licenseTypeNameQueryFilterValue,
  ]);

  // Debounced trigger function
  const debouncedTrigger = useCallback(
    debounce((filters) => {
      trigger(filters);
    }, 1200),
    [trigger]
  );

  // Clean up debounce on unmount
  useEffect(() => {
    return () => {
      debouncedTrigger.cancel();
    };
  }, [debouncedTrigger]);

  const reload = () => {
    trigger({
      pageNumber,
      pageSize,
      name: providerNameFiltervalue,
      email: emailQueryFilterValue,
      status: statusQueryFilterValue,
      facilityId: facilityNameQueryFilterValue,
      licenseTypeId: licenseTypeNameQueryFilterValue,
      sortBy: sortingDetails?.sortingField,
      direction: sortingDetails?.isDescending ? "DSC" : "ASC",
    });
  };

  useEffect(() => {
    debouncedTrigger({
      pageNumber,
      pageSize,
      name: providerNameFiltervalue,
      email: emailQueryFilterValue,
      status: statusQueryFilterValue,
      facilityId: facilityNameQueryFilterValue,
      licenseTypeId: licenseTypeNameQueryFilterValue,
      sortBy: sortingDetails?.sortingField,
      direction: sortingDetails?.isDescending ? "DSC" : "ASC",
    });
  }, [
    pageNumber,
    pageSize,
    providerNameFiltervalue,
    emailQueryFilterValue,
    statusQueryFilterValue,
    facilityNameQueryFilterValue,
    licenseTypeNameQueryFilterValue,
    sortingDetails,
    debouncedTrigger,
  ]);

  useEffect(() => {
    setProviderNameFiltervalue(undefined);
  }, [selectedFilterkey]);

  const TableFilters = (
    <Space direction="vertical">
      <Space size="small">
        <Select
          value={selectedFilterkey}
          onChange={(value) => {
            setSelectedFilterkey(value);
          }}
          style={{ width: "140px" }}
          options={[
            { value: "name", label: "Name" },
            { value: "email", label: "Email" },
            { value: "status", label: "Status" },
            { value: "facility", label: "Facility" },
            {
              value: "licensetype",
              label: "License Type",
            },
          ]}
        />
        {selectedFilterkey === "name" && (
          <Input
            onChange={(event) => {
              setProviderNameFiltervalue(event?.target?.value);
            }}
            value={providerNameFiltervalue}
            style={{
              width: "320px",
            }}
            allowClear
            placeholder="Find by providers"
          />
        )}
        {selectedFilterkey === "email" && (
          <Input
            onChange={(event) => {
              setEmailQueryFilterValue(event?.target?.value);
            }}
            style={{
              width: "320px",
            }}
            placeholder="Find by email"
            allowClear
            value={providerNameFiltervalue}
          />
        )}
        {selectedFilterkey === "status" && (
          <Select
            key="status-select"
            placeholder="Select status"
            allowClear
            value={statusQueryFilterValue}
            onChange={(value) => {
              setStatusQueryFilterValue(value);
            }}
            style={{ width: "320px" }}
            options={StatusOptions}
          />
        )}
        {selectedFilterkey === "facility" && (
          <Select
            allowClear={true}
            showSearch={true}
            optionFilterProp="label"
            placeholder="Select facility"
            value={facilityNameQueryFilterValue}
            onChange={(value) => {
              setFacilityNameQueryFilterValue(value);
            }}
            style={{ width: "320px" }}
            options={facilities?.map((facility) => ({
              label: facility?.name,
              searchValue: facility?.name,
              value: facility?.id + "",
            }))}
          />
        )}
        {selectedFilterkey === "licensetype" && (
          <Select
            allowClear={true}
            showSearch={true}
            optionFilterProp="label"
            placeholder="Select license type"
            value={licenseTypeNameQueryFilterValue}
            onChange={(value) => {
              setLicenseTypeNameQueryFilterValue(value);
            }}
            style={{ width: "320px" }}
            options={licenseTypes?.map((licenseType) => ({
              label: licenseType?.name,
              searchValue: licenseType?.name,
              value: licenseType?.id + "",
            }))}
          />
        )}
      </Space>
      <div>
        {!!statusQueryFilterValue && (
          <Tag
            closeIcon
            onClose={() => {
              setStatusQueryFilterValue(undefined);
            }}
          >
            <span>
              Status ={" "}
              {
                StatusOptions?.find(
                  (stautsOption) =>
                    stautsOption?.value === statusQueryFilterValue
                )?.label
              }
            </span>
          </Tag>
        )}
        {!!facilityNameQueryFilterValue && (
          <Tag
            closeIcon
            onClose={() => {
              setFacilityNameQueryFilterValue(undefined);
            }}
          >
            <span>
              Facility ={" "}
              {
                facilities?.find(
                  (facility) =>
                    facility?.id + "" === facilityNameQueryFilterValue + ""
                )?.name
              }
            </span>
          </Tag>
        )}
        {!!licenseTypeNameQueryFilterValue && (
          <Tag
            closeIcon
            onClose={() => {
              setLicenseTypeNameQueryFilterValue(undefined);
            }}
          >
            <span>
              License Type ={" "}
              {
                licenseTypes?.find(
                  (licenseType) =>
                    licenseType?.id + "" ===
                    licenseTypeNameQueryFilterValue + ""
                )?.name
              }
            </span>
          </Tag>
        )}
      </div>
    </Space>
  );

  return {
    TableFilters,
    filteredProviders: providersData?.providers || [],
    providerTotalRecords: providersData?.totalRecords ?? 0,
    UseQueryHookResult: {
      reload,
      isLoading: facilitiesLoading && licenseTypesLoading && providersLoading,
      isFetching,
      pageNumber,
      setPageNumber,
      pageSize,
      setPageSize,
      sortingDetails,
      setSortingDetails,
    },
  };
}
