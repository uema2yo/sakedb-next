"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/lib/store"
import { addDocument } from "@/lib/firebase/addDocument";
import { getDocuments } from "@/lib/firebase/getDocuments";
import Loading from "@/components/Loading";
import ImageUploader from "@/components/Form/ImageUploader";
import EditableFields from "@/components/Form/EditableFields";
import { validateForms } from "@/lib/code/validateForms";
import { formatDate, generateUniqueToken, getLabelFromCode, loadArrayFromJSON } from "@/lib/util";
import { GENDER_CODES } from "@/constants";
import type { GetCollectionConfig } from "@/types/getDocumentsConfig";
import type { DocumentData } from "firebase/firestore";

interface UserProfileItem {
  [key: string]: {
    public: boolean;
    value:  boolean | string | number;
  };
}

// 初期 ID/ユーサー名
const altUserId = `user-${generateUniqueToken(12)}`;
const altUserName = `ユーザー${generateUniqueToken(6)}`;

const ProfileModule = () => {
  const uid = useSelector((state: RootState) => state.auth.uid) as string;
  const profileImageUrl = useSelector((state: RootState) => state.profileImage.url);

  console.log("profileImageUrl",profileImageUrl)

  const profileConfig: {
    [key: string]: GetCollectionConfig
  } = {
    id: {
      collectionName: "b_user_id",
      conditions: [{ name: "uid", operator: "==", value: uid }],
      public_only: false,
      order_by: { field: "timestamp", direction: "desc" },
      limit_num: 1,
    },
    name: {
			collectionName: "b_user_name",
			conditions: [{ name: "uid", operator: "==", value: uid }],
			public_only: false,
			order_by: { field: "timestamp", direction: "desc" },
			limit_num: 1
		},
		gender: {
			collectionName: "b_user_gender",
			conditions: [{ name: "uid", operator: "==", value: uid }],
			public_only: false,
			order_by: { field: "timestamp", direction: "desc" },
			limit_num: 1
		},
		birthdate: {
			collectionName: "b_user_birthdate",
			conditions: [{ name: "uid", operator: "==", value: uid }],
			public_only: false,
			order_by: { field: "timestamp", direction: "desc" },
			limit_num: 1
		},
		residenceRegion: {
			collectionName: "b_user_residenceRegion",
			conditions: [{ name: "uid", operator: "==", value: uid }],
			public_only: false,
			order_by: { field: "timestamp", direction: "desc" },
			limit_num: 1
		},
		residenceCountry: {
			collectionName: "b_user_residenceCountry",
			conditions: [{ name: "uid", operator: "==", value: uid }],
			public_only: false,
			order_by: { field: "timestamp", direction: "desc" },
			limit_num: 1
		},
		residencePrefecture: {
			collectionName: "b_user_residencePrefecture",
			conditions: [{ name: "uid", operator: "==", value: uid }],
			public_only: false,
			order_by: { field: "timestamp", direction: "desc" },
			limit_num: 1
		},
		residenceCity: {
			collectionName: "b_user_residenceCity",
			conditions: [{ name: "uid", operator: "==", value: uid }],
			public_only: false,
			order_by: { field: "timestamp", direction: "desc" },
			limit_num: 1
		}
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
  //const [profileImageUrl, setProfileImageUrl] = useState("");

  //const profileImageUrl = useSelector((state: RootState) => state.profileImage.url);
  const field = {
    id: {
      id: "id",
      fields: [
        {
          name: "public",
          type: "checkbox",
          checked: userProfileItem.id?.public as boolean,
          disabled: true,
        },
        { name: "value",
          type: "text",
          value: userProfileItem.id?.value
        },
      ],
    },
    name: {
      id: "name",
      fields: [
        {
          name: "public",
          type: "checkbox",
          checked: userProfileItem.name?.public,
          disabled: true,
        },
        { name: "value",
          type: "text",
          value: userProfileItem.name?.value
        },
      ],
    },
    gender: {
      id: "gender",
      fields: [
        {
          name: "public",
          type: "checkbox",
          checked: userProfileItem.gender?.public,
          disabled: false,
        },
        {
          name: "value",
          type: "select",
          value: userProfileItem.gender?.value,
          options: GENDER_CODES,
        },
      ],
    },
    birthdate: {
      id: "birthdate",
      fields: [
        {
          name: "public",
          type: "checkbox",
          checked: userProfileItem.birthdate?.public,
          disabled: false,
        },
        { name: "value",
          type: "date",
          value: userProfileItem.birthdate?.value },
      ],
    },
    residenceRegion: {
      id: "residenceRegion",
      fields: [
        {
          name: "public",
          type: "checkbox",
          checked: userProfileItem.residenceRegion?.public,
          disabled: false,
        },
        {
          name: "value",
          type: "select",
          value: userProfileItem.residenceRegion?.value,
          options: subregions,
        },
      ],
    },
    residenceCountry: {
      id: "residenceCountry",
      fields: [
        {
          name: "public",
          type: "checkbox",
          checked: userProfileItem.residenceCountry?.public,
          disabled: false,
        },
        {
          name: "value",
          type: "select",
          value: userProfileItem.residenceCountry?.value,
          options: countries,
        },
      ],
    },
    residencePrefecture: {
      id: "residencePrefecture",
      fields: [
        {
          name: "public",
          type: "checkbox",
          checked: userProfileItem.residencePrefecture?.public,
          disabled: false,
        },
        {
          name: "value",
          type: "select",
          value: userProfileItem.residencePrefecture?.value,
          options: prefectures,
        },
      ],
    },
    residenceCity: {
      id: "residenceCity",
      fields: [
        {
          name: "public",
          type: "checkbox",
          checked: userProfileItem.residenceCity?.public,
          disabled: false,
        },
        {
          name: "value",
          type: "select",
          value: userProfileItem.residenceCity?.value,
          options: cities,
        },
      ],
    },
  };

  const getCurrentUserProfile = (
    doc: { public: boolean; value: string | number | boolean },
    alt: string | number
  ) => {
    return {
      public: doc ? doc.public : false,
      value: doc ? doc.value : alt,
      //defaultEditMode: doc?.value === undefined,
    };
  }

  async function refreshCurrentUserProfile(configName?: string | null) {
    let res: Array<{ public: boolean; value: string | number | boolean }> = [];
    if (configName && configName !== "") {
      res = (await getDocuments([profileConfig[configName]])) as Array<{
        public: boolean;
        value: string | number | boolean;
      }>;
      setDocument(prev => ({
        ...prev,
        [configName]: res[0]
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

  const validate = async(id: string, value: string | number | boolean, saveOnly:boolean ) => {
    return await validateForms( id, value, saveOnly, uid);
  }

  const setSelectOptionItems = {
    region: async () => {
      const subregionConfigs: GetCollectionConfig[] = [{
        collectionName: "b_code_region",
        order_by: {field: "order", direction: "asc"}
      }];
      const subregionItems = await getDocuments(subregionConfigs);
      setSubregions(subregionItems);
    },
    country: async() => {
      const configs: GetCollectionConfig[] = [{
        collectionName: "b_code_country",
        conditions: [{ name: "subregion", operator: "==", value: document.residenceRegion?.value || "030" }],
      }];
      const items = await getDocuments(configs);
      setCountries(items);
    },
    prefecture: async() => {
      const configs: GetCollectionConfig[] = [{
        collectionName: "b_code_prefecture",
        order_by: {field: "order", direction: "asc"}
      }];
      const items = await getDocuments(configs);
      setPrefectures(items);
    },
    city: async() => {
      const configs: GetCollectionConfig[] = [{
        collectionName: "b_code_city",
        conditions: [{ name: "prefecture", operator: "==", value: Number(document.residencePrefecture?.value) || 13 }],
        order_by: {field: "code", direction: "asc"}
      }];
      const items = await getDocuments(configs);
      console.log("cities", items,document.residencePrefecture?.value)
      setCities(items);
    }
  }

  const handleSave = {
    id: async(form: { elements: { namedItem: (arg0: string) => { value: string; }; }; }) => {
      const value = form.elements.namedItem("id-value").value;
      const valid = await validate("id", value, false );
      valid.result && await save2Collection("id", "b_user_id", {value: value, public: true});
      return valid;
    },
    name: async(form: { elements: { namedItem: (arg0: string) => { value: string; }; }; }) => {
      const value = form.elements.namedItem("name-value").value;
      const valid = await validate("name", value, false );
      valid.result && await save2Collection("name", "b_user_name", {value: value, public: true});
      return valid;
    },
    gender: async(form: { elements: { namedItem: (arg0: string) => {value: string; checked: boolean }; }; }) => {
      const value = form.elements.namedItem("gender-value").value;
      const publicChecked = form.elements.namedItem("gender-public").checked;
      await save2Collection("gender", "b_user_gender", {value: value, public: publicChecked});
      return { result: true };
    },
    birthdate: async(form: { elements: { namedItem: (arg0: string) => { value: string; checked: boolean}; }; }) => {
      const value = form.elements.namedItem("birthdate-value").value;
      const publicChecked = form.elements.namedItem("birthdate-public").checked;
      const valid = await validate("birthdate", value, false );
      valid.result && await save2Collection("birthdate", "b_user_birthdate", {value: value, public: publicChecked});
      return valid;
    },
    residenceRegion: async(form: { elements: { namedItem: (arg0: string) => {value: string; checked: boolean; }; }; }) => {
      const value = form.elements.namedItem("residenceRegion-value").value;
      const publicChecked = form.elements.namedItem("residenceRegion-public").checked;
      await save2Collection("residenceRegion", "b_user_residenceRegion", {value: value, public: publicChecked});
      return { result: true };
    },
    residenceCountry: async(form: { elements: { namedItem: (arg0: string) => {value: string; checked: boolean; }; }; }) => {
      const value = form.elements.namedItem("residenceCountry-value").value;
      const publicChecked = form.elements.namedItem("residenceCountry-public").checked;
      await save2Collection("residenceCountry", "b_user_residenceCountry", {value: value, public: publicChecked});
      return { result: true };
    },
    residencePrefecture: async(form: { elements: { namedItem: (arg0: string) => {value: string; checked: boolean; }; }; }) => {
      const value = form.elements.namedItem("residencePrefecture-value").value;
      const publicChecked = form.elements.namedItem("residencePrefecture-public").checked;
      await save2Collection("residencePrefecture", "b_user_residencePrefecture", {value: value, public: publicChecked});
      return { result: true };
    },
    residenceCity: async(form: { elements: { namedItem: (arg0: string) => {value: string; checked: boolean; }; }; }) => {
      const value = form.elements.namedItem("residenceCity-value").value;
      const publicChecked = form.elements.namedItem("residenceCity-public").checked;
      await save2Collection("residenceCity", "b_user_residenceCity", {value: value, public: publicChecked});
      return { result: true };
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
    setSelectOptionItems.region();
    setSelectOptionItems.country();
    setSelectOptionItems.prefecture();
    setSelectOptionItems.city();
    refreshCurrentUserProfile();
  },[]);
 
  useEffect(() => {
    setUserProfileItem({
      ...userProfileItem,
      id: getCurrentUserProfile(document.id, altUserId),
      name: getCurrentUserProfile(document.name, altUserName),
      gender: getCurrentUserProfile(document.gender, 0),
      birthdate: getCurrentUserProfile(document.birthdate, "2000-01-01"),
      residenceRegion: getCurrentUserProfile(document.residenceRegion, "030"),
      residenceCountry: getCurrentUserProfile(document.residenceCountry, "00"),
      residencePrefecture: getCurrentUserProfile(document.residencePrefecture, "00"),
      residenceCity: getCurrentUserProfile(document.residenceCity, "00"),
    });
  },[document]);
  
  useEffect(() => {
    setSelectOptionItems.country();
  },[document.residenceRegion])

  useEffect(() => {
    setSelectOptionItems.city();
  },[document.residencePrefecture])

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <article>
          <h2>
          </h2>
          <figure>
            <figcaption>
            {(document.id?.value && document.name?.value) && 
              <>
              {document.name?.value}（{document.id?.value}）さんのプロフィール
              </>
            }
            </figcaption>
            {uid ?
              <ImageUploader collectionName="b_user_profileImage" options={{width: 800, height: 800, aspectKeep: true, maxDataSize: 250}} />:
              <img src={profileImageUrl} />
            }
          </figure>
          <section>
            <h3>ユーザーID</h3>
            {
            <EditableFields
              field={field.id}
              isPublic={userProfileItem.id.public===true}
              userLoggedIn={uid!==""}
              validate={validate}
              defaultEditMode={document.id?.value===undefined}
              save={handleSave.id}
            >
              <span>{userProfileItem.id.public ? "公開" : "非公開"}</span>
              {userProfileItem.id.value}
            </EditableFields> }
          </section>
          <section>
            <h3>ユーザー名</h3>
            {
            <EditableFields
              field={field.name}
              isPublic={userProfileItem.name.public===true}
              userLoggedIn={uid!==""}
              defaultEditMode={document.name?.value===undefined}
              save={handleSave.name}
            >
              <span>{userProfileItem.name.public ? "公開" : "非公開"}</span>
              {userProfileItem.name.value}
            </EditableFields> }
          </section>

          <section>
            <h3>性別</h3>
            {
            <EditableFields
              field={field.gender}
              isPublic={userProfileItem.gender.public===true}
              userLoggedIn={uid!==""}
              validate={validate}
              defaultEditMode={document.gender?.value===undefined}
              save={handleSave.gender}
            >
              <span>{userProfileItem.gender.public ? "公開" : "非公開"}</span>
              {getLabelFromCode(GENDER_CODES, Number(userProfileItem.gender.value), "ja")}
            </EditableFields> }
          </section>
          <section>
            <h3>生年月日</h3>
            {
              <EditableFields
              field={field.birthdate}
              isPublic={userProfileItem.birthdate.public===true}
              userLoggedIn={uid!==""}
              validate={validate}
              defaultEditMode={document.birthdate?.value===undefined}
              save={handleSave.birthdate}
            >
              <span>{userProfileItem.birthdate.public ? "公開" : "非公開"}</span>
              {formatDate(userProfileItem.birthdate.value as string, "ja")}
            </EditableFields> }
          </section>
          <section>
            <h3>在住地域</h3>
            {
            <EditableFields
              field={field.residenceRegion}
              isPublic={userProfileItem.residenceRegion.public===true}
              userLoggedIn={uid!==""}
              validate={validate}
              defaultEditMode={document.residenceRegion?.value===undefined}
              save={handleSave.residenceRegion}
              default="00"
            >
              <span>{userProfileItem.residenceRegion.public ? "公開" : "非公開"}</span>
              {subregions && getLabelFromCode(subregions, userProfileItem.residenceRegion.value as string,"ja")}
            </EditableFields> }
          </section>
          <section>
            <h3>在住国</h3>
            {
            <EditableFields
              field={field.residenceCountry}
              isPublic={userProfileItem.residenceCountry.public===true}
              userLoggedIn={uid!==""}
              validate={validate}
              defaultEditMode={document.residenceCountry?.value===undefined}
              save={handleSave.residenceCountry}
              default="00"
            >
              <span>{userProfileItem.residenceCountry.public ? "公開" : "非公開"}</span>
              {countries && getLabelFromCode(countries, userProfileItem.residenceCountry.value as string, "ja")}
            </EditableFields> }
          </section>
          <section>
            <h3>在住都道府県</h3>
            {
            <EditableFields
              field={field.residencePrefecture}
              isPublic={userProfileItem.residencePrefecture.public===true}
              userLoggedIn={uid!==""}
              validate={validate}
              defaultEditMode={document.residencePrefecture?.value===undefined}
              save={handleSave.residencePrefecture}
              default="00"
            >
              <span>{userProfileItem.residencePrefecture.public ? "公開" : "非公開"}</span>
              {prefectures && getLabelFromCode(prefectures, Number(userProfileItem.residencePrefecture.value), "ja")}
            </EditableFields> }
          </section>
          <section>
            <h3>在住市区町村</h3>
            {
            <EditableFields
              field={field.residenceCity}
              isPublic={userProfileItem.residenceCity.public===true}
              userLoggedIn={uid!==""}
              validate={validate}
              defaultEditMode={document.residenceCity?.value===undefined}
              save={handleSave.residenceCity}
              default="00"
            >
              <span>{userProfileItem.residenceCity.public ? "公開" : "非公開"}</span>
              {cities && getLabelFromCode(cities, Number(userProfileItem.residenceCity.value), "ja")}
            </EditableFields> }
          </section>
        </article>
      )}
    </>
  );
};

export default ProfileModule;
