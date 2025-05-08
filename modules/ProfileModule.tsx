import { useState, useEffect } from "react";
import { addDocument } from "@/lib/firebase/addDocument";
import { getDocuments } from "@/lib/firebase/getDocuments";
import type { GetCollectionConfig } from "@/types/getDocumentsConfig";
import Loading from "@/components/Loading";
import EditableFields from "@/components/Form/EditableFields";
import { validateForms } from "@/lib/code/validateForms";
import { formatDate, generateUniqueToken, getLabelFromCode, loadArrayFromJSON } from "@/lib/util";
import { GENDER_CODES } from "@/constants";
import { sign } from "crypto";

interface Props {
  uid: string;
}

interface UserProfileItem {
  [key: string]: { 
    public: boolean; 
    value:  boolean | string | number;
  };
}

const ProfileModule = (props: Props) => {
  console.log(props)
  const profileConfig: {
    [key: string]: GetCollectionConfig
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
			limit_num: 1
		},
		gender: {
			collectionName: "b_user_gender",
			conditions: [{ name: "uid", operator: "==", value: props.uid }],
			public_only: false,
			order_by: { field: "timestamp", direction: "desc" },
			limit_num: 1
		},
		birthdate: {
			collectionName: "b_user_birthdate",
			conditions: [{ name: "uid", operator: "==", value: props.uid }],
			public_only: false,
			order_by: { field: "timestamp", direction: "desc" },
			limit_num: 1
		},
		residenceRegion: {
			collectionName: "b_user_residenceRegion",
			conditions: [{ name: "uid", operator: "==", value: props.uid }],
			public_only: false,
			order_by: { field: "timestamp", direction: "desc" },
			limit_num: 1
		},
		residenceCountry: {
			collectionName: "b_user_residenceCountry",
			conditions: [{ name: "uid", operator: "==", value: props.uid }],
			public_only: false,
			order_by: { field: "timestamp", direction: "desc" },
			limit_num: 1
		},
		residencePrefecture: {
			collectionName: "b_user_residencePrefecture",
			conditions: [{ name: "uid", operator: "==", value: props.uid }],
			public_only: false,
			order_by: { field: "timestamp", direction: "desc" },
			limit_num: 1
		},
		residenceCity: {
			collectionName: "b_user_residenceCity",
			conditions: [{ name: "uid", operator: "==", value: props.uid }],
			public_only: false,
			order_by: { field: "timestamp", direction: "desc" },
			limit_num: 1
		}
	};
  // 初期 ID/ユーサー名
  const altUserId = `user-${generateUniqueToken(12)}`;
  const altUserName = `ユーザー${generateUniqueToken(6)}`;

  const [userProfileItem, setUserProfileItem] = useState<UserProfileItem>(
    {
      id: { public: true, value: altUserId },
      name: { public: true, value: altUserName },
      gender: { public: true, value: 0 },
      birthdate: { public: false, value: 0 },
      residenceRegion: { public: true, value: 0 },
      residenceCountry: { public: false, value: 0 },
      residencePrefecture: { public: false, value: 0 },
      residenceCity: { public: false, value: 0 },
      favoriteRegion: { public: false, value: 0 },
      favoriteCountry: { public: false, value: 0 },
      favoritePrefecture: { public: false, value: 0 },
      favoriteCity: { public: false, value: 0 },  
    }
  )
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [subregions, setSubregions] = useState<{code: number,label: Record<string, string>;}[]>();

  const field = {
    id: {
      id: "id",
      //collectionName: "b_user_id",
      fields: [
        {
          name: "public",
          type: "checkbox",
          checked: userProfileItem.id.public as boolean,
          disabled: true,
        },
        { name: "value",
          type: "text",
          value: userProfileItem.id.value
        },
      ],
    },
    name: {
      id: "name",
      //collectionName: "b_user_name",
      fields: [
        {
          name: "public",
          type: "checkbox",
          checked: userProfileItem.name.public,
          disabled: true,
        },
        { name: "value",
          type: "text",
          value: userProfileItem.name.value
        },
      ],
    },
    gender: {
      id: "gender",
      //collectionName: "b_user_gender",
      fields: [
        {
          name: "public",
          type: "checkbox",
          checked: userProfileItem.gender.public,
          disabled: false,
        },
        {
          name: "value",
          type: "select",
          value: userProfileItem.gender.value,
          options: GENDER_CODES,
        },
      ],
    },
    birthdate: {
      id: "birthdate",
      //collectionName: "b_user_birthdate",
      fields: [
        {
          name: "public",
          type: "checkbox",
          checked: userProfileItem.birthdate.public,
          disabled: false,
        },
        { name: "value",
          type: "date",
          value: userProfileItem.birthdate.value },
      ],
    },
    residenceRegion: {
      id: "residenceRegion",
      //collectionName: "b_user_residenceRegion",
      fields: [
        {
          name: "public",
          type: "checkbox",
          checked: userProfileItem.residenceRegion.public,
          disabled: false,
        },
        {
          name: "value",
          type: "select",
          value: userProfileItem.residenceRegion.value,
          options: subregions,
        },
      ],
    },
  };
/*
  const [nameField, setNameField] = useState({
    id: "name",
    collectionName: "b_user_name",
    fields: [
      {
        name: "public",
        type: "checkbox",
        value: userProfileItem.name.public,
        disabled: true,
        label: "公開",
      },
      { name: "value", type: "text", value: userProfileItem.name.value },
    ]
  });

  const [genderField, setGenderField] = useState({
    id: "name",
    collectionName: "b_user_gender",
    fields: [
      {
        name: "public",
        type: "checkbox",
        value: userProfileItem.gender.public,
        disabled: false,
        label: "",
      },
      { name: "value", type: "text", value: userProfileItem.name.value },
    ]
  });
  */
  /*
  const [idField, setIdField] = useState({
    id: "id",
    collectionName: "b_user_id",
    fields: [
      {
        name: "public",
        type: "checkbox",
        value: userProfileItem.id.public,
        disabled: true,
        label: "公開",
      },
      { name: "value", type: "text", value: userProfileItem.id.value },
    ]
  });

  const [nameField, setNameField] = useState({
    id: "name",
    collectionName: "b_user_name",
    fields: [
      {
        name: "public",
        type: "checkbox",
        value: userProfileItem.name.public,
        disabled: true,
        label: "公開",
      },
      { name: "value", type: "text", value: userProfileItem.name.value },
    ]
  });

  const [genderField, setGenderField] = useState({
    id: "name",
    collectionName: "b_user_gender",
    fields: [
      {
        name: "public",
        type: "checkbox",
        value: userProfileItem.gender.public,
        disabled: false,
        label: "",
      },
      { name: "value", type: "text", value: userProfileItem.name.value },
    ]
  });
  */
/*
  const setField: { [key: string]: () => void } =  {
    id: () => {
      setUserProfileItem({
        ...userProfileItem,
        id: getCurrentUserProfile(document.id, altUserId),  
      })
    },
    name: () => {
      setUserProfileItem({
        ...userProfileItem,
        name: getCurrentUserProfile(document.name, altUserName),  
      })
    },
    gender: () => {
      setUserProfileItem({
        ...userProfileItem,
        name: getCurrentUserProfile(document.gender, 0),  
      })
    }
  }*/

  const [document, setDocument] = useState<Record<string, { public: boolean; value: string | number | boolean }>>({});

  const getCurrentUserProfile = (
    doc: { public: boolean; value: string | number | boolean },
    alt: string | number
  ) => {
    return {
      public: doc ? doc.public : false,
      value: doc ? doc.value : alt,
    };
  }

  async function refreshCurrentUserProfile(configName?: string | null) {
    let res: Array<{ public: boolean; value: string | number | boolean }> = [];
    if (configName && configName !== "") {
      res = await getDocuments([profileConfig[configName]]) as Array<{ public: boolean; value: string | number | boolean }>;
      setDocument(prev => ({
        ...prev,
        [configName]: res[0]
      }));
    } else {
      let updatedDoc = { ...document };
      for (const [name, config] of Object.entries(profileConfig)) {
        res = await getDocuments([config]) as Array<{ public: boolean; value: string | number | boolean }>;
        updatedDoc[name] = res[0];
      }
      setDocument(updatedDoc);
    }
    /*
    userProfileItem.name = getCurrentUserProfile(document.name, "名無し");
		userProfileItem.gender = getCurrentUserProfile(document.gender, 0);
		userProfileItem.birthdate = getCurrentUserProfile(
			document.birthdate,
			getFormatedDate(getDateOffset("years", 30))
		);
		userProfileItem.residenceRegion = getCurrentUserProfile(document.residenceRegion, 1);
		userProfileItem.residenceCountry = getCurrentUserProfile(
			document.residenceCountry,
			userProfileItem.residenceRegion.value === 1 ? 192 : 0
		);

		console.log(
			"userProfileItem.residenceRegion ",
			document,
			userProfileItem.residenceRegion,
			userProfileItem.residenceCountry
		);

		userProfileItem.residencePrefecture = getCurrentUserProfile(document.residencePrefecture, 0);
		userProfileItem.residenceCity = getCurrentUserProfile(document.residenceCity, 0);
		const currentUserGenderFormat = genderOptions.find(
			(genderOption) => genderOption.value === userProfileItem.gender.value
		);
		userProfileItem.gender.format = currentUserGenderFormat && currentUserGenderFormat.label;
		userProfileItem.birthdate.format = getFormatedDate(userProfileItem.birthdate.value, "ja");

		//Region
		const residenceRegionFormat = residenceRegionOptions.find(
			(regionOption) => regionOption.value === userProfileItem.residenceRegion.value
		);
		userProfileItem.residenceRegion.format =
			residenceRegionFormat && residenceRegionFormat.innerText;

		//country
		residenceCountryOptions = await getCountryOptions(userProfileItem.residenceRegion.value);
		const residenceCountryFormat = residenceCountryOptions.find(
			(countryOption) => countryOption.value === userProfileItem.residenceCountry.value
		);
		userProfileItem.residenceCountry.format = residenceCountryFormat
			? residenceCountryFormat.innerText
			: "----";

		//prefecture
		const residencePrefectureFormat = residencePrefectureOptions.find(
			(prefectureOption) => prefectureOption.value === userProfileItem.residencePrefecture.value
		);
		userProfileItem.residencePrefecture.format =
			residencePrefectureFormat && residencePrefectureFormat.innerText;

		//city
		residenceCityOptions = await getCityOptions(userProfileItem.residencePrefecture.value);
		const residenceCityFormat = residenceCityOptions.find(
			(cityOption) => cityOption.value === userProfileItem.residenceCity.value
		);
		userProfileItem.residenceCity.format = residenceCityFormat
			? residenceCityFormat.innerText
			: "----";
    */

    setLoading(false);
  }

  const validate = async(id: string, value: string | number | boolean, saveOnly:boolean ) => {
    return await validateForms( id, value, saveOnly, props.uid);
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
  };

  async function save2Collection(configName: string, collectionName: string, doc: { [key: string]: string | number | boolean }) {
    if (saving) return;
    setSaving(true);
    await addDocument(collectionName, doc)
      .then(async () => {
        refreshCurrentUserProfile(configName);
        //setField[configName]();
        setSaving(false);
      })
      .catch((error) => {
        console.error("保存中にエラーが発生しました:", error);
        setSaving(false);
      });  
  }

  useEffect(() => {
    (async () => {
      const subregions = await loadArrayFromJSON("/subregions.json");
      setSubregions(subregions);
    })();
    refreshCurrentUserProfile();
    setLoading(false);
  },[]);

  useEffect(() => {
    setUserProfileItem({
      ...userProfileItem,
      id: getCurrentUserProfile(document.id, altUserId),
      name: getCurrentUserProfile(document.name, altUserName),
      gender: getCurrentUserProfile(document.gender, 0),
      birthdate: getCurrentUserProfile(document.birthdate, "2000-01-01"),
      residenceRegion: getCurrentUserProfile(document.residenceRegion, "030"),
    })
  },[document]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <article>
          <h2>
            {userProfileItem.name.value}（{userProfileItem.id.value}）さんのプロフィール
          </h2>
          <section>
            <h3>ユーザーID</h3>
            {
            <EditableFields
              field={field.id}
              isPublic={userProfileItem.id.public===true}
              userLoggedIn={props.uid!==""}
              validate={validate}
              save={handleSave.id}
              //startEditing={setField.id}
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
              userLoggedIn={props.uid!==""}
              save={handleSave.name}
              //startEditing={setField.name}
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
              userLoggedIn={props.uid!==""}
              validate={validate}
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
              userLoggedIn={props.uid!==""}
              validate={validate}
              save={handleSave.birthdate}
              //startEditing={setField.name}
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
              userLoggedIn={props.uid!==""}
              validate={validate}
              save={handleSave.residenceRegion}
            >
              <span>{userProfileItem.residenceRegion.public ? "公開" : "非公開"}</span>
              {subregions && getLabelFromCode(subregions, userProfileItem.residenceRegion.value as string,"ja")}
            </EditableFields> }
          </section>
          <section>
            <h3>在住国</h3>
            {
            <EditableFields
              field={field.residenceRegion}
              isPublic={userProfileItem.residenceRegion.public===true}
              userLoggedIn={props.uid!==""}
              validate={validate}
              save={handleSave.residenceRegion}
            >
              <span>{userProfileItem.residenceRegion.public ? "公開" : "非公開"}</span>
              {subregions && getLabelFromCode(subregions, userProfileItem.residenceRegion.value as string,"ja")}
            </EditableFields> }
          </section>

        </article>
      )}
    </>
  );
};

export default ProfileModule;
