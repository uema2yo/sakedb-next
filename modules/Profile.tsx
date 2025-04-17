import { useState } from "react";
import { addDocument } from "@lib/firebase/addDocument";
import { getDocuments } from "@lib/firebase/getDocuments";
import Loading from "@components/Loading";
import { collection } from "firebase/firestore/lite";
import EditableFields from "@components/Form/EditableFields";

interface Props {
  uid: string;
}

const Profile = (props: Props) => {
  const userProfile: {
    [key: string]: { [key: string]: boolean | string | number };
  } = {
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
  };

  const profileConfig: {
    [key: string]: {
      collectionName: string;
      conditions: [{}];
      public_only: boolean;
      order_by: { field: string; direction: string };
      limit_num: number;
    };
  } = {
    id: {
      collectionName: "b_user_id",
      conditions: [{ name: "uid", operator: "==", value: props.uid }],
      public_only: false,
      order_by: { field: "timestamp", direction: "desc" },
      limit_num: 1,
    },
  };
  /*
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
			collectionName: "b_user_residence_region",
			conditions: [{ name: "uid", operator: "==", value: uid }],
			public_only: false,
			order_by: { field: "timestamp", direction: "desc" },
			limit_num: 1
		},
		residenceCountry: {
			collectionName: "b_user_residence_country",
			conditions: [{ name: "uid", operator: "==", value: uid }],
			public_only: false,
			order_by: { field: "timestamp", direction: "desc" },
			limit_num: 1
		},
		residencePrefecture: {
			collectionName: "b_user_residence_prefecture",
			conditions: [{ name: "uid", operator: "==", value: uid }],
			public_only: false,
			order_by: { field: "timestamp", direction: "desc" },
			limit_num: 1
		},
		residenceCity: {
			collectionName: "b_user_residence_city",
			conditions: [{ name: "uid", operator: "==", value: uid }],
			public_only: false,
			order_by: { field: "timestamp", direction: "desc" },
			limit_num: 1
		}
	};
*/

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [idField, setIdField] = useState({
    id: "id",
    collectionName: "b_user_id",
    fields: [
      {
        name: "public",
        type: "checkbox",
        value: userProfile.id.public,
        disabled: true,
        label: "公開",
      },
      { name: "value", type: "text", value: userProfile.id.value },
    ],
  });

  async function setFields() {
    setIdField({
      id: "id",
      collectionName: "b_user_id",
      fields: [
        {
          name: "public",
          type: "checkbox",
          value: userProfile.id.public,
          disabled: true,
          label: "公開",
        },
        { name: "value", type: "text", value: userProfile.id.value },
      ],
    });
  }

  const document = {};

  async function refreshCurrentUserProfile(configName?: string | null) {
    let res;
    /*
    if (configName && configName !== "") {
      res = await getDocuments([profileConfig[configName]]);
      document[configName] = res[0];
    } else {
      for (const [name, config] of Object.entries(profileConfig)) {
        res = await getDocuments([config]);
        document[name] = res[0];
      }
    }
    */
    function getCurrentUserProfile(
      doc: { public: boolean; value: string | number },
      alt: string | number
    ) {
      return {
        public: doc ? doc.public : false,
        value: doc ? doc.value : alt,
      };
    }

    const userAltName = "user";

    // userProfile.id = getCurrentUserProfile(document.id, userAltName);
    /*
    userProfile.name = getCurrentUserProfile(document.name, "名無し");
		userProfile.gender = getCurrentUserProfile(document.gender, 0);
		userProfile.birthdate = getCurrentUserProfile(
			document.birthdate,
			getFormatedDate(getDateOffset("years", 30))
		);
		userProfile.residenceRegion = getCurrentUserProfile(document.residenceRegion, 1);
		userProfile.residenceCountry = getCurrentUserProfile(
			document.residenceCountry,
			userProfile.residenceRegion.value === 1 ? 192 : 0
		);

		console.log(
			"userProfile.residenceRegion ",
			document,
			userProfile.residenceRegion,
			userProfile.residenceCountry
		);

		userProfile.residencePrefecture = getCurrentUserProfile(document.residencePrefecture, 0);
		userProfile.residenceCity = getCurrentUserProfile(document.residenceCity, 0);
		const currentUserGenderFormat = genderOptions.find(
			(genderOption) => genderOption.value === userProfile.gender.value
		);
		userProfile.gender.format = currentUserGenderFormat && currentUserGenderFormat.label;
		userProfile.birthdate.format = getFormatedDate(userProfile.birthdate.value, "ja");

		//Region
		const residenceRegionFormat = residenceRegionOptions.find(
			(regionOption) => regionOption.value === userProfile.residenceRegion.value
		);
		userProfile.residenceRegion.format =
			residenceRegionFormat && residenceRegionFormat.innerText;

		//country
		residenceCountryOptions = await getCountryOptions(userProfile.residenceRegion.value);
		const residenceCountryFormat = residenceCountryOptions.find(
			(countryOption) => countryOption.value === userProfile.residenceCountry.value
		);
		userProfile.residenceCountry.format = residenceCountryFormat
			? residenceCountryFormat.innerText
			: "----";

		//prefecture
		const residencePrefectureFormat = residencePrefectureOptions.find(
			(prefectureOption) => prefectureOption.value === userProfile.residencePrefecture.value
		);
		userProfile.residencePrefecture.format =
			residencePrefectureFormat && residencePrefectureFormat.innerText;

		//city
		residenceCityOptions = await getCityOptions(userProfile.residencePrefecture.value);
		const residenceCityFormat = residenceCityOptions.find(
			(cityOption) => cityOption.value === userProfile.residenceCity.value
		);
		userProfile.residenceCity.format = residenceCityFormat
			? residenceCityFormat.innerText
			: "----";
*/
    setLoading(false);
  }

  function handleSave(event: {
    detail: { field: { fields: any[]; collectionName: string; id: string } };
  }) {
    if (saving) return;
    setSaving(true);
    let doc: { [key: string]: boolean | string | number } = {};
    event.detail.field.fields.forEach(
      (field: { name: string; value: string | number }) => {
        const { name, value } = field;
        doc[name] = value;
      }
    );
    addDocument(event.detail.field.collectionName, doc)
      .then(async () => {
        userProfile[event.detail.field.id] = doc;
        refreshCurrentUserProfile(event.detail.field.id);
        setFields();
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
            {userProfile.name.value}（{userProfile.id.value}）さんのプロフィール
          </h2>
          <section>
            <h3>ユーザーID</h3>
            {/*
            <EditableFields
              field={idField}
              isPublic
              isUserLoggedIn
              save={handleSave}
              startEditing={setFields}
            >
              <span>{userProfile.id.public ? "公開" : "非公開"}</span>
              {userProfile.id.value}
            </EditableFields> */}
          </section>
        </article>
      )}
    </>
  );
};

export default Profile;
