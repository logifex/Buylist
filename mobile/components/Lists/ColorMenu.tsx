import { ColorValue, StyleSheet, View } from "react-native";
import React from "react";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { List } from "@/models/List";
import BottomModal from "@/components/Ui/BottomModal";
import MenuItem from "@/components/Ui/MenuItem";

interface ColorDetails {
  listColor: List["color"];
  text: string;
  color: ColorValue;
}

interface Props {
  onRequestClose: () => void;
  onPick: (color: List["color"]) => void;
  ref: React.RefObject<BottomSheetModal | null>;
}

const colors: ColorDetails[] = [
  { listColor: "GRAY", text: "אפור", color: "#BDBDBD" },
  { listColor: "BROWN", text: "חום", color: "#795548" },
  { listColor: "RED", text: "אדום", color: "#fe011f" },
  { listColor: "BLUE", text: "כחול", color: "#019dfe" },
  { listColor: "GREEN", text: "ירוק", color: "#00d22a" },
  { listColor: "YELLOW", text: "צהוב", color: "#fee001" },
  { listColor: "PINK", text: "ורוד", color: "#F06292" },
];

const ColorMenu = ({ onRequestClose, onPick, ref }: Props) => {
  const handleColorPick = (color: List["color"]) => {
    onRequestClose();
    onPick(color);
  };

  return (
    <BottomModal
      ref={ref}
      title="צבע הרשימה"
      snapPoints={["60%"]}
      enableDynamicSizing={false}
      closeKeyboard
      onRequestClose={onRequestClose}
    >
      <BottomSheetScrollView>
        {colors.map((color) => (
          <MenuItem
            key={color.listColor}
            text={color.text}
            startComponent={
              <View
                style={[
                  styles.colorRectangle,
                  { backgroundColor: color.color },
                ]}
              />
            }
            onPress={() => {
              handleColorPick(color.listColor);
            }}
          />
        ))}
      </BottomSheetScrollView>
    </BottomModal>
  );
};

const styles = StyleSheet.create({
  colorRectangle: {
    width: 20,
    height: 20,
  },
});

export default ColorMenu;
