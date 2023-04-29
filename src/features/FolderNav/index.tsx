import { Icon } from "../../components/Icon";
import { Text } from "../../components/Text";
import { AllFiles } from "../../types";
import { RecursiveFolder } from "./RecursiveFolder";
import css from "./folderNav.module.css";

const treeStructure: AllFiles = [
  {
    name: "Just Collected",
  },
  {
    name: "Really looooong folder name lorem ipsum asdfjoisjadiofjsdofijiwdjfi",
    subFolders: [
      {
        name: "Folder 1",
        subFolders: [
          {
            name: "Hello Andrew",
          },
        ],
      },
      {
        name: "Folder 2",
      },
      {
        name: "Depth 2",
        subFolders:[
          {
            name:"Depth 3",
            subFolders:[
              {
                name:"Depth 4",
                subFolders:[
                  {
                    name:"Depth 5",
                    subFolders:[
                      {
                        name:"lol good job",
                        
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
    ],
  },
];

export const FolderNav = () => {
  return (
    <div className={css.container}>
      <Text type="heading" bold className={css.title}>
        <Icon name="folder" />
        Folders
      </Text>
      {treeStructure.map((folders, i) => (
        <RecursiveFolder folders={folders} key={i} onHeightChange={()=>console.log("parent height change")} />
      ))}
    </div>
  );
};

//[folder1:[folder2:]]
