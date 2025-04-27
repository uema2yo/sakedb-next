import { useState, useEffect } from "react";
import { addDocument } from "@lib/firebase/addDocument";
import { getDocuments } from "@lib/firebase/getDocuments";
import type { GetCollectionConfig } from "@lib/firebase/getDocuments"
import { VALIDATION_ERROR_CODES } from "@constants";
import type { ValidationErrorCode } from "@constants";
import Loading from "@components/Loading";
import { collection } from "firebase/firestore/lite";
import { getDoc, doc } from "firebase/firestore";
import EditableFields from "@components/Form/EditableFields";
import { getDocument } from "@lib/firebase/getDocument";
import { updateDocument } from "@lib/firebase/updateDocument";

interface Props {
  uid: string;
}

interface UserProfileItem {
  [key: string]: { [key: string]: boolean | string | number };
  //[key: string]: { public: boolean, value: boolean | string | number };
}

const ProfileModule = (props: Props) => {
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
			collectionName: "b_user_residence_region",
			conditions: [{ name: "uid", operator: "==", value: props.uid }],
			public_only: false,
			order_by: { field: "timestamp", direction: "desc" },
			limit_num: 1
		},
		residenceCountry: {
			collectionName: "b_user_residence_country",
			conditions: [{ name: "uid", operator: "==", value: props.uid }],
			public_only: false,
			order_by: { field: "timestamp", direction: "desc" },
			limit_num: 1
		},
		residencePrefecture: {
			collectionName: "b_user_residence_prefecture",
			conditions: [{ name: "uid", operator: "==", value: props.uid }],
			public_only: false,
			order_by: { field: "timestamp", direction: "desc" },
			limit_num: 1
		},
		residenceCity: {
			collectionName: "b_user_residence_city",
			conditions: [{ name: "uid", operator: "==", value: props.uid }],
			public_only: false,
			order_by: { field: "timestamp", direction: "desc" },
			limit_num: 1
		}
	};

  const [userProfileItem, setUserProfileItem] = useState<UserProfileItem>(
    {
      id: { public: true, value: "" },
      name: { public: true, value: "" },
      gender: { public: false, value: 0 },
      //birthdate: { public: false, value: 0, format: "" },
      birthdate: { public: false, value: 0 },
      residenceRegion: { public: false, value: 0 },
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

  const setField: { [key: string]: () => void } =  {
    id: () => {
      setIdField({
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
        ],
      });
    },
    name: () => {
      setNameField({
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
        ],
      });
    },
  }
  const [document, setDocument] = useState<Record<string, { public: boolean; value: string | number | boolean }>>({});

  const altUserId = "user";
  const altUserName = "ユーザー";

  const getCurrentUserProfile = (
    doc: { public: boolean; value: string | number | boolean },
    alt: string | number
  ) => {
    return {
      public: doc ? doc.public : false,
      value: doc ? doc.value : alt,
    };
  }

  useEffect( () => {
    refreshCurrentUserProfile();
    setLoading(false);
  },[]);

  useEffect(() => {
    setUserProfileItem({
      ...userProfileItem,
      id: getCurrentUserProfile(document.id, altUserId),
      name: getCurrentUserProfile(document.name, altUserName),
    })
  },[document]);

  async function refreshCurrentUserProfile(configName?: string | null) {
    let res: Array<{ public: boolean; value: string | number | boolean }> = [];
    console.log(configName)
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
    console.log( userProfileItem.id)
    console.log( userProfileItem.name)

    setLoading(false);
  }

  const validate = async(id: string, value: string | number | boolean ) => {
    const execute: {[key:string]: () => Promise<{ result: boolean; message?: string | undefined; }>} = {
      id: async() => {
        const duplicateIdConfig: GetCollectionConfig = {
          collectionName: "b_user_id",
          conditions: [
            { name: "value", operator: "==", value: value },
            { name: "uid", operator: "!=", value: props.uid  },
          ],
        };
        const duplicateItems = await getDocuments([duplicateIdConfig]) as Array<{ public: boolean; value: string | number | boolean }>;
        
        console.log("duplicateItems",id, duplicateItems);
        if(/[^a-zA-Z0-9_]/.test(value as string) ){
          return {
            result: false,
            message: `ユーザー ID は、半角英数と「_」以外は使用できません。`
          }
        } else if ( duplicateItems.length > 0) {
          return {
            result: false,
            message: `このユーザー ID は、他のユーザーがすでに使用しています。`
          }
        } else {
          return {
            result: true,
          };
        }
      },
    }
    console.log("validate",id, value, await execute[id]())
    const a =await execute[id]()

    return await execute[id]();
  }
  const handleSave = {
    id: async(form: { elements: { namedItem: (arg0: string) => { value: string; }; }; }) => {
      const id = form.elements.namedItem("id").value;
      await save2Collection("id", "b_user_id", {value: id, public: true})
      
/*      
      const duplicateIdConfig: GetCollectionConfig = {
        collectionName: "b_user_id",
        conditions: [{ name: "value", operator: "==", value: id }],
      };
      const duplicateItems = await getDocuments([duplicateIdConfig]) as Array<{ public: boolean; value: string | number | boolean }>;
      
      console.log("dup",duplicateItems)
      if(duplicateItems.length === 0) {
        await save2Collection("id", "b_user_id", {value: id, public: true})
      } else {
        
        console.error("このユーザー ID はすでに使われています。")
      }*/
    },
    name: async(form: { elements: { namedItem: (arg0: string) => { value: string; }; }; }) => {
      const name = form.elements.namedItem("name").value;
      await save2Collection("name", "b_user_name", {value: name, public: true})
    }
  };

  async function save2Collection(configName: string, collectionName: string, doc: { [key: string]: string | number | boolean }) {
    if (saving) return;
    setSaving(true);
    await addDocument(collectionName, doc)
      .then(async () => {
        //userProfileItem[event.detail.field.id] = doc;
        refreshCurrentUserProfile(configName);
        setField[configName]();
        setSaving(false);
      })
      .catch((error) => {
        console.error("保存中にエラーが発生しました:", error);
        setSaving(false);
      });
    
  }

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
              field={idField}
              isPublic={userProfileItem.id.public===true}
              userLoggedIn={props.uid!==""}
              validate={validate}
              save={handleSave.id}
              startEditing={setField.id}
            >
              <span>{userProfileItem.id.public ? "公開" : "非公開"}</span>
              {userProfileItem.id.value}
            </EditableFields> }
          </section>
          <section>
          <h3>ユーザー名</h3>
            {
            <EditableFields
              field={nameField}
              isPublic={userProfileItem.name.public===true}
              userLoggedIn={props.uid!==""}
              save={handleSave.name}
              startEditing={setField.name}
            >
              <span>{userProfileItem.name.public ? "公開" : "非公開"}</span>
              {userProfileItem.name.value}
            </EditableFields> }

          </section>
        </article>
      )}
    </>
  );
};

export default ProfileModule;
