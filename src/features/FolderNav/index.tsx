import { AllFiles } from "../../types";
import { RecursiveFolder } from "./Folder";
import css from "./folderNav.module.css";

const treeStructure: AllFiles = [
  {
    name: "Just Collected",
  },
  {
    name: "OHHHH FOLDERiojsdojfgdfgdfgdfg",
    subFolders: [
        {
            "name":"Folder 1",
            "subFolders":[
                {
                    "name":"Hello Andrew"
                }
            ]
        },
        {
            "name":"Folder 2"
        },
        {
          "name":"Folder 1",
          "subFolders":[
              {
                  "name":"Hello Andrew"
              }
          ]
      },
      {
          "name":"Folder 2"
      }
    ]
  },
];

export const FolderNav = () => {
  return (
    <div className={css.container}>
      {treeStructure.map((folders,i) => (
        <RecursiveFolder folders={folders} key={i} />
      ))}
    </div>
  );
};

//[folder1:[folder2:]]
