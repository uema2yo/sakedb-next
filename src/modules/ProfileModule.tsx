"use client";

import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import { addDocument } from "@/lib/firebase/addDocument";
import { getDocuments } from "@/lib/firebase/getDocuments";
import Loading from "@/components/Loading";
import ImageUploader from "@/components/Form/ImageUploader";
import EditableFields from "@/components/Form/EditableFields";
import { validateForms } from "@/lib/code/validateForms";
import { formatDate, generateUniqueToken, getLabelFromCode } from "@/lib/utils";
import { GENDER_CODES } from "@/constants";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import type { GetCollectionConfig } from "@/types/getDocumentsConfig";
import type { DocumentData } from "firebase/firestore";
import { read } from "node:fs";
import { AvatarFallback } from "@radix-ui/react-avatar";

interface Props {
  uid: string;
  readonly: boolean;
}

interface UserProfileItem {
  [key: string]: {
    public: boolean;
    value: boolean | string | number;
  };
}

// 初期 ID/ユーサー名
const altUserId = `user-${generateUniqueToken(12)}`;
const altUserName = `ユーザー${generateUniqueToken(6)}`;

const ProfileModule = (props: Props) => {
  const uid = useSelector((state: RootState) => state.auth.uid) as string;
  const profileConfig: {
    [key: string]: GetCollectionConfig;
  } = {
    id: {
      collectionName: "b_user_id",
      conditions: [{ name: "uid", operator: "==", value: props.uid }],
      public_only: false,
      order_by: { field: "timestamp", direction: "desc" },
      limit_num: 1,
    },
    name: {
      collectionName: "b_user_name",
      conditions: [{ name: "uid", operator: "==", value: props.uid }],
      public_only: false,
      order_by: { field: "timestamp", direction: "desc" },
      limit_num: 1,
    },
    iamgeUrl: {
      collectionName: "b_user_profileImage",
      conditions: [{ name: "uid", operator: "==", value: props.uid }],
      public_only: false,
      order_by: { field: "timestamp", direction: "desc" },
      limit_num: 1,
    },
    gender: {
      collectionName: "b_user_gender",
      conditions: [{ name: "uid", operator: "==", value: props.uid }],
      public_only: false,
      order_by: { field: "timestamp", direction: "desc" },
      limit_num: 1,
    },
    birthdate: {
      collectionName: "b_user_birthdate",
      conditions: [{ name: "uid", operator: "==", value: props.uid }],
      public_only: false,
      order_by: { field: "timestamp", direction: "desc" },
      limit_num: 1,
    },
    residenceRegion: {
      collectionName: "b_user_residenceRegion",
      conditions: [{ name: "uid", operator: "==", value: props.uid }],
      public_only: false,
      order_by: { field: "timestamp", direction: "desc" },
      limit_num: 1,
    },
    residenceCountry: {
      collectionName: "b_user_residenceCountry",
      conditions: [{ name: "uid", operator: "==", value: props.uid }],
      public_only: false,
      order_by: { field: "timestamp", direction: "desc" },
      limit_num: 1,
    },
    residencePrefecture: {
      collectionName: "b_user_residencePrefecture",
      conditions: [{ name: "uid", operator: "==", value: props.uid }],
      public_only: false,
      order_by: { field: "timestamp", direction: "desc" },
      limit_num: 1,
    },
    residenceCity: {
      collectionName: "b_user_residenceCity",
      conditions: [{ name: "uid", operator: "==", value: props.uid }],
      public_only: false,
      order_by: { field: "timestamp", direction: "desc" },
      limit_num: 1,
    },
    introduction: {
      collectionName: "b_user_introduction",
      conditions: [{ name: "uid", operator: "==", value: props.uid }],
      public_only: false,
      order_by: { field: "timestamp", direction: "desc" },
      limit_num: 1,
    },
  };

  const getProfileImageUrl = async () => {
    const res = await getDocuments([profileConfig.iamgeUrl]);
    console.log("image", res);
    return res[0].value;
  };

  const [userProfileItem, setUserProfileItem] = useState<UserProfileItem>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [subregions, setSubregions] = useState<DocumentData[]>();
  const [countries, setCountries] = useState<DocumentData[]>();
  const [prefectures, setPrefectures] = useState<DocumentData[]>();
  const [cities, setCities] = useState<DocumentData[]>();
  const [document, setDocument] = useState<
    Record<string, { public: boolean; value: string | number | boolean }>
  >({});
  const [profileImageUrl, setProfileImageUrl] = useState(
    useSelector((state: RootState) => state.profileImage.url)
  );
  const field = useMemo(
    () => (
      console.log("subregions", subregions, countries, prefectures, cities),
      {
      id: {
        id: "id",
        fields: [
          {
            name: "public",
            type: "switch",
            checked: userProfileItem.id?.public as boolean,
            value: userProfileItem.id?.public as boolean,
            disabled: true,
            label: {on: "公開", off: "非公開"},
          },
          { name: "value", type: "text", value: userProfileItem.id?.value, label: "ユーザーID" },
        ],
      },
      name: {
        id: "name",
        fields: [
          {
            name: "public",
            type: "switch",
            checked: userProfileItem.name?.public,
            value: userProfileItem.name?.public as boolean,
            disabled: true,
            label: {on: "公開", off: "非公開"},
          },
          { name: "value", type: "text", value: userProfileItem.name?.value, label: "ユーザー名" },
        ],
      },
      gender: {
        id: "gender",
        fields: [
          {
            name: "public",
            type: "switch",
            checked: userProfileItem.gender?.public,
            value: userProfileItem.gender?.public ?? false,
            disabled: false,
            label: {on: "公開", off: "非公開"},
          },
          {
            name: "value",
            type: "select",
            value: userProfileItem.gender?.value,
            options: GENDER_CODES,
            label: "性別",
          },
        ],
      },
      birthdate: {
        id: "birthdate",
        fields: [
          {
            name: "public",
            type: "switch",
            checked: userProfileItem.birthdate?.public,
            value: userProfileItem.birthdate?.public,
            disabled: false,
            label: {on: "公開", off: "非公開"},
          },
          {
            name: "value",
            type: "date",
            value: userProfileItem.birthdate?.value,
            label: "生年月日",
          },
        ],
      },
      residenceRegion: {
        id: "residenceRegion",
        fields: [
          {
            name: "public",
            type: "switch",
            checked: userProfileItem.residenceRegion?.public,
            value: userProfileItem.residenceRegion?.public ?? false,
            disabled: false,
            label: {on: "公開", off: "非公開"},
          },
          {
            name: "value",
            type: "select",
            value: userProfileItem.residenceRegion?.value,
            options: subregions,
            label: "在住地域",
          },
        ],
      },
      residenceCountry: {
        id: "residenceCountry",
        fields: [
          {
            name: "public",
            type: "switch",
            checked: userProfileItem.residenceCountry?.public ?? false,
            value: userProfileItem.residenceCountry?.public ?? false,
            disabled: false,
            label: {on: "公開", off: "非公開"},
          },
          {
            name: "value",
            type: "select",
            value: userProfileItem.residenceCountry?.value ?? "",
            options: Array.isArray(countries)
              ? countries.map((item) => ({
                  code: item.code,
                  label: item.label,
                }))
              : [],
            label: "在住国",
          },
        ],
      },
      residencePrefecture: {
        id: "residencePrefecture",
        fields: [
          {
            name: "public",
            type: "switch",
            checked: userProfileItem.residencePrefecture?.public,
            value: userProfileItem.residencePrefecture?.public ?? false,
            disabled: false,
            label: {on: "公開", off: "非公開"},
          },
          {
            name: "value",
            type: "select",
            value: userProfileItem.residencePrefecture?.value,
            options: Array.isArray(prefectures)
              ? prefectures.map((item) => ({
                  code: item.code,
                  label: item.label,
                }))
              : [],
            label: "在住都道府県",
          },
        ],
      },
      residenceCity: {
        id: "residenceCity",
        fields: [
          {
            name: "public",
            type: "switch",
            checked: userProfileItem.residenceCity?.public,
            value: userProfileItem.residenceCity?.public ?? false,
            disabled: false,
            label: {on: "公開", off: "非公開"},
          },
          {
            name: "value",
            type: "select",
            value: userProfileItem.residenceCity?.value,
            options: Array.isArray(cities)
              ? cities.map((item) => ({
                  code: item.code,
                  label: item.label,
                }))
              : [],
            label: "在住市区町村",
          },
        ],
      },
      introduction: {
        id: "introduction",
        fields: [
          {
            name: "public",
            type: "switch",
            checked: userProfileItem.introduction?.public as boolean,
            value: userProfileItem.introduction?.public ?? false,
            disabled: true,
            label: {on: "公開", off: "非公開"},
          },
          {
            name: "value",
            type: "textarea",
            value: userProfileItem.introduction?.value ?? "",
            limit: 200,
            label: "自己紹介",
          },
        ],
      },
    }),
    [userProfileItem, subregions, countries, prefectures, cities]
  );

  const getCurrentUserProfile = (
    doc: { public: boolean; value: string | number | boolean },
    alt: string | number
  ) => {
    return {
      public: doc ? doc.public : false,
      value: doc ? doc.value : alt,
    };
  };

  async function refreshCurrentUserProfile(configName?: string | null) {
    let res: Array<{ public: boolean; value: string | number | boolean }> = [];
    if (configName && configName !== "") {
      res = (await getDocuments([profileConfig[configName]])) as Array<{
        public: boolean;
        value: string | number | boolean;
      }>;
      setDocument((prev) => ({
        ...prev,
        [configName]: res[0],
      }));
    } else {
      let updatedDoc = { ...document };
      for (const [name, config] of Object.entries(profileConfig)) {
        res = (await getDocuments([config])) as Array<{
          public: boolean;
          value: string | number | boolean;
        }>;
        updatedDoc[name] = res[0];
      }
      setDocument(updatedDoc);
    }
    setLoading(false);
  }

  const validate = async (
    id: string,
    value: string | number | boolean,
    saveOnly: boolean,
    options?: { limit: number }
  ) => {
    return await validateForms(id, value, saveOnly);
  };

  const setSelectOptionItems = {
    region: async () => {
      const subregionConfigs: GetCollectionConfig[] = [
        {
          collectionName: "b_code_region",
          order_by: { field: "order", direction: "asc" },
        },
      ];
      const subregionItems = await getDocuments(subregionConfigs);
      setSubregions(subregionItems);
    },
    country: async () => {
      const configs: GetCollectionConfig[] = [
        {
          collectionName: "b_code_country",
          conditions: [
            {
              name: "subregion",
              operator: "==",
              value: document.residenceRegion?.value || "030",
            },
          ],
        },
      ];
      const items = await getDocuments(configs);
      setCountries(items);
    },
    prefecture: async () => {
      const configs: GetCollectionConfig[] = [
        {
          collectionName: "b_code_prefecture",
          order_by: { field: "order", direction: "asc" },
        },
      ];
      const items = await getDocuments(configs);
      setPrefectures(items);
    },
    city: async () => {
      const configs: GetCollectionConfig[] = [
        {
          collectionName: "b_code_city",
          conditions: [
            {
              name: "prefecture",
              operator: "==",
              value: Number(document.residencePrefecture?.value) || 13,
            },
          ],
          order_by: { field: "code", direction: "asc" },
        },
      ];
      const items = await getDocuments(configs);
      setCities(items);
    },
  };

  const handleSave = {
    id: async (data: any) => {
      const value = data["id-value"] || data.value;
      const valid = await validate("id", value, false);
      valid.result &&
        (await save2Collection("id", "b_user_id", {
          value: value,
          public: true,
        }));
      return valid;
    },
    name: async (data: any) => {
      const value = data["name-value"] || data.value;
      const valid = await validate("name", value, false);
      valid.result &&
        (await save2Collection("name", "b_user_name", {
          value: value,
          public: true,
        }));
      return valid;
    },
    gender: async (data: any) => {
      const value = data["gender-value"] || data.value;
      const publicChecked = data["gender-public"] || data.public;
      await save2Collection("gender", "b_user_gender", {
        value: value,
        public: publicChecked,
      });
      return { result: true };
    },
    birthdate: async (data: any) => {
      const value = data["birthdate-value"] || data.value;
      console.log("birthdate", data, value);
      const publicChecked = data["birthdate-public"] || data.public;
      const valid = await validate("birthdate", value, false);
      valid.result &&
        (await save2Collection("birthdate", "b_user_birthdate", {
          value: value,
          public: publicChecked,
        }));
      return valid;
    },
    residenceRegion: async (data: any) => {
      const value = data["residenceRegion-value"] || data.value;
      const publicChecked = data["residenceRegion-public"] || data.public;
      await save2Collection("residenceRegion", "b_user_residenceRegion", {
        value: value,
        public: publicChecked,
      });
      return { result: true };
    },
    residenceCountry: async (data: any) => {
      const value = data["residenceCountry-value"] || data.value;
      const publicChecked = data["residenceCountry-public"] || data.public;
      await save2Collection("residenceCountry", "b_user_residenceCountry", {
        value: value,
        public: publicChecked,
      });
      return { result: true };
    },
    residencePrefecture: async (data: any) => {
      const value = data["residencePrefecture-value"] || data.value;
      const publicChecked = data["residencePrefecture-public"] || data.public;
      await save2Collection(
        "residencePrefecture",
        "b_user_residencePrefecture",
        { value: value, public: publicChecked }
      );
      return { result: true };
    },
    residenceCity: async (data: any) => {
      const value = data["residenceCity-value"] || data.value;
      const publicChecked = data.residenceCityPublic || data.public;
      await save2Collection("residenceCity", "b_user_residenceCity", {
        value: value,
        public: publicChecked,
      });
      return { result: true };
    },
    introduction: async (data: any) => {
      const value = data["introduction-value"] || data.value;
      const valid = await validate("introduction", value, false, {
        limit: 200,
      });
      valid.result &&
        (await save2Collection("introduction", "b_user_introduction", {
          value: value,
          public: true,
        }));
      return valid;
    },
  };

  const save2Collection = async (
    configName: string,
    collectionName: string,
    doc: { [key: string]: string | number | boolean }
  ) => {
    if (saving) return;
    setSaving(true);
    await addDocument(collectionName, doc)
      .then(async () => {
        refreshCurrentUserProfile(configName);
        setSaving(false);
      })
      .catch((error) => {
        console.error("保存中にエラーが発生しました:", error);
        setSaving(false);
      });
  };

  useEffect(() => {
    if (props.readonly) {
      (async () => {
        const url = await getProfileImageUrl();
        setProfileImageUrl(url);
      })();
    }
    setSelectOptionItems.region();
    setSelectOptionItems.country();
    setSelectOptionItems.prefecture();
    setSelectOptionItems.city();
    refreshCurrentUserProfile();
  }, []);

  useEffect(() => {
    setUserProfileItem({
      ...userProfileItem,
      id: getCurrentUserProfile(document.id, altUserId),
      name: getCurrentUserProfile(document.name, altUserName),
      gender: getCurrentUserProfile(document.gender, 0),
      birthdate: getCurrentUserProfile(document.birthdate, "2000-01-01"),
      residenceRegion: getCurrentUserProfile(document.residenceRegion, "030"),
      residenceCountry: getCurrentUserProfile(document.residenceCountry, "00"),
      residencePrefecture: getCurrentUserProfile(
        document.residencePrefecture,
        "00"
      ),
      residenceCity: getCurrentUserProfile(document.residenceCity, "00"),
      introduction: getCurrentUserProfile(document.introduction, ""),
    });
  }, [document]);

  useEffect(() => {
    console.log("document.residenceRegion", document.residenceRegion);
    setSelectOptionItems.country();
  }, [document.residenceRegion]);

  useEffect(() => {
    setSelectOptionItems.city();
  }, [document.residencePrefecture]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <figure className="mb-8">
            {props.uid && !props.readonly ? (
              <ImageUploader
                collectionName="b_user_profileImage"
                options={{
                  width: 800,
                  height: 800,
                  aspectKeep: true,
                  maxDataSize: 250,
                }}
              />
            ) : (
              profileImageUrl !== "" && (
                <>
                  <figcaption className="mb-4">プロフィール画像</figcaption>
                  <Avatar className="w-48 h-48 m-auto">
                    <AvatarImage
                      src={profileImageUrl}
                      alt={`${document.name.value} のプロフィール画像`}
                    />
                    <AvatarFallback>
                      <img
                        src="/images/noimage.png"
                        alt="プロフィール画像の代替"
                      />
                    </AvatarFallback>
                  </Avatar>
                </>
              )
            )}
          </figure>
          <dl className="dl-profile grid grid-cols-3 gap-4">
            <dt>ユーザーID</dt>
            <dd className="col-span-2">
              {props.readonly ? (
                userProfileItem.id.public ? (
                  <span>{userProfileItem.id.value}</span>
                ) : (
                  <span>非公開</span>
                )
              ) : (
                <EditableFields
                  field={field.id}
                  isPublic={userProfileItem.id.public === true}
                  userLoggedIn={props.uid !== ""}
                  validate={validate}
                  defaultEditMode={document.id?.value === undefined}
                  save={handleSave.id}
                >
                  <span>{userProfileItem.id.public ? "公開" : "非公開"}</span>
                  {userProfileItem.id.value}
                </EditableFields>
              )}
            </dd>
            <dt>ユーザー名</dt>
            <dd className="col-span-2">
              {props.readonly ? (
                userProfileItem.name.public ? (
                  <>{userProfileItem.name.value}</>
                ) : (
                  <span>非公開</span>
                )
              ) : (
                <EditableFields
                  field={field.name}
                  isPublic={userProfileItem.name.public === true}
                  userLoggedIn={props.uid !== ""}
                  defaultEditMode={document.name?.value === undefined}
                  save={handleSave.name}
                >
                  <span>{userProfileItem.name.public ? "公開" : "非公開"}</span>
                  {userProfileItem.name.value}
                </EditableFields>
              )}
            </dd>
            <dt>性別</dt>
            <dd className="col-span-2">
              {props.readonly ? (
                userProfileItem.gender.public ? (
                  <>
                    {getLabelFromCode(
                      GENDER_CODES,
                      Number(userProfileItem.gender.value),
                      "ja"
                    )}
                  </>
                ) : (
                  <span>非公開</span>
                )
              ) : (
                <EditableFields
                  field={field.gender}
                  isPublic={userProfileItem.gender.public === true}
                  userLoggedIn={props.uid !== ""}
                  validate={validate}
                  defaultEditMode={document.gender?.value === undefined}
                  save={handleSave.gender}
                >
                  <span>
                    {userProfileItem.gender.public ? "公開" : "非公開"}
                  </span>
                  {getLabelFromCode(
                    GENDER_CODES,
                    Number(userProfileItem.gender.value),
                    "ja"
                  )}
                </EditableFields>
              )}
            </dd>
            <dt>生年月日</dt>
            <dd className="col-span-2">
              {props.readonly ? (
                userProfileItem.birthdate.public ? (
                  <>
                    {userProfileItem.birthdate.value
                      ? formatDate(
                          userProfileItem.birthdate.value as string,
                          "ja"
                        )
                      : "----年--月--日"}
                    {userProfileItem.birthdate.value as string}
                  </>
                ) : (
                  <span>非公開</span>
                )
              ) : (
                <EditableFields
                  field={field.birthdate}
                  isPublic={userProfileItem.birthdate.public === true}
                  userLoggedIn={props.uid !== ""}
                  validate={validate}
                  defaultEditMode={document.birthdate?.value === undefined}
                  save={handleSave.birthdate}
                >
                  <span>
                    {userProfileItem.birthdate.public ? "公開" : "非公開"}
                  </span>
                  {userProfileItem.birthdate.value
                    ? formatDate(
                        userProfileItem.birthdate.value as string,
                        "ja"
                      )
                    : "----年--月--日"}
                </EditableFields>
              )}
            </dd>
            <dt>在住地域</dt>
            <dd className="col-span-2">
              {props.readonly ? (
                userProfileItem.residenceRegion.public ? (
                  <>
                    {subregions &&
                      getLabelFromCode(
                        subregions,
                        userProfileItem.residenceRegion.value as string,
                        "ja"
                      )}
                  </>
                ) : (
                  <span>非公開</span>
                )
              ) : (
                <EditableFields
                  field={field.residenceRegion}
                  isPublic={userProfileItem.residenceRegion.public === true}
                  userLoggedIn={props.uid !== ""}
                  validate={validate}
                  defaultEditMode={
                    document.residenceRegion?.value === undefined
                  }
                  save={handleSave.residenceRegion}
                  default="00"
                >
                  <span>
                    {userProfileItem.residenceRegion.public ? "公開" : "非公開"}
                  </span>
                  {subregions &&
                    getLabelFromCode(
                      subregions,
                      userProfileItem.residenceRegion.value as string,
                      "ja"
                    )}
                </EditableFields>
              )}
            </dd>
            <dt>在住国</dt>
            <dd className="col-span-2">
              {props.readonly ? (
                userProfileItem.residenceCountry.public ? (
                  <>
                    {countries &&
                      getLabelFromCode(
                        countries,
                        userProfileItem.residenceCountry.value as string,
                        "ja"
                      )}
                  </>
                ) : (
                  <span>非公開</span>
                )
              ) : (
                <EditableFields
                  field={field.residenceCountry}
                  isPublic={userProfileItem.residenceCountry.public === true}
                  userLoggedIn={props.uid !== ""}
                  validate={validate}
                  defaultEditMode={
                    document.residenceCountry?.value === undefined
                  }
                  save={handleSave.residenceCountry}
                  default="00"
                >
                  <span>
                    {userProfileItem.residenceCountry.public
                      ? "公開"
                      : "非公開"}
                  </span>
                  {countries &&
                    getLabelFromCode(
                      countries,
                      userProfileItem.residenceCountry.value as string,
                      "ja"
                    )}
                </EditableFields>
              )}
            </dd>
            <dt>在住都道府県</dt>
            <dd className="col-span-2">
              {props.readonly ? (
                userProfileItem.residencePrefecture.public ? (
                  <>
                    {prefectures &&
                      getLabelFromCode(
                        prefectures,
                        Number(userProfileItem.residencePrefecture.value),
                        "ja"
                      )}
                  </>
                ) : (
                  <span>非公開</span>
                )
              ) : (
                <EditableFields
                  field={field.residencePrefecture}
                  isPublic={userProfileItem.residencePrefecture.public === true}
                  userLoggedIn={props.uid !== ""}
                  validate={validate}
                  defaultEditMode={
                    document.residencePrefecture?.value === undefined
                  }
                  save={handleSave.residencePrefecture}
                  default="00"
                >
                  <span>
                    {userProfileItem.residencePrefecture.public
                      ? "公開"
                      : "非公開"}
                  </span>
                  {prefectures &&
                    getLabelFromCode(
                      prefectures,
                      Number(userProfileItem.residencePrefecture.value),
                      "ja"
                    )}
                </EditableFields>
              )}
            </dd>
            <dt>在住市区町村</dt>
            <dd className="col-span-2">
              {props.readonly ? (
                userProfileItem.residenceCity.public ? (
                  <>
                    {cities &&
                      getLabelFromCode(
                        cities,
                        Number(userProfileItem.residenceCity.value),
                        "ja"
                      )}
                  </>
                ) : (
                  <span>非公開</span>
                )
              ) : (
                <EditableFields
                  field={field.residenceCity}
                  isPublic={userProfileItem.residenceCity.public === true}
                  userLoggedIn={props.uid !== ""}
                  validate={validate}
                  defaultEditMode={document.residenceCity?.value === undefined}
                  save={handleSave.residenceCity}
                  default="00"
                >
                  <span>
                    {userProfileItem.residenceCity.public ? "公開" : "非公開"}
                  </span>
                  {cities &&
                    getLabelFromCode(
                      cities,
                      Number(userProfileItem.residenceCity.value),
                      "ja"
                    )}
                </EditableFields>
              )}
            </dd>
            <dt>自己紹介</dt>
            <dd className="col-span-2">
              {props.readonly ? (
                userProfileItem.introduction.public ? (
                  <>{userProfileItem.introduction.value}</>
                ) : (
                  <span>非公開</span>
                )
              ) : (
                <EditableFields
                  field={field.introduction}
                  isPublic={userProfileItem.introduction.public === true}
                  userLoggedIn={props.uid !== ""}
                  validate={validate}
                  defaultEditMode={document.introduction?.value === undefined}
                  save={handleSave.introduction}
                >
                  <span>
                    {userProfileItem.introduction.public ? "公開" : "非公開"}
                  </span>
                  {userProfileItem.introduction.value}
                </EditableFields>
              )}
            </dd>
          </dl>
        </>
      )}
    </>
  );
};

export default ProfileModule;
