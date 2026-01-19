import { StockItem } from "@/types/inventory";

export const inventoryByBox: Record<string, [string, number][]> = {
  "BOX BS1": [["3M Blue Tape 1 Inch", 12], ["3M Blue Tape 2 Inch", 9], ["3M Yellow Tape 1 Inch", 15], ["3M Yellow Tape 2 Inch", 7]],
  "BOX BS2": [["3M White Masking Tape", 2], ["3M Celetape Brown 2 inch", 12], ["Scotch Double Sided Tape 2 inch", 3], ["3M Painters Tape", 2], ["3M New Painters Tape 240x16m", 2], ["3M White Duct Tape", 2], ["3M Nonskid Clear Tape", 2]],
  "BOX BS3": [["3M Blue Applicator Pads", 15], ["Orange Applicator Pads", 10], ["Ultra Fine Microfibre Cloths", 3], ["Shout Wipes", 1], ["Scotch Brite Lint Rollers", 4], ["Magic Erasers", 15]],
  "BOX BS4": [["3M Dual Lock", 2], ["Black Velcro 1 inch", 1], ["Hazard Tape 2 inch", 1], ["Foam Tape 2 inch", 1], ["Scotch Black Stretchy Rubber Tape", 3], ["Green Electrical Tape", 0], ["Blue Electrical Tape", 1], ["Yellow Electrical Tape", 2], ["Red Electrical Tape", 1], ["Yellow Green Stripy Tape", 2], ["Black Electrical Tape", 3], ["Scotch Mounting Tape", 2], ["3M SOLAS Reflective Tape", 1], ["PTFE", 3], ["Silver Reflective Tape", 1], ["Marble Granite Repairs Kit", 2]],
  "BOX BS5 & BS5+": [["Sikaflex 291 White", 3], ["Sikaflex 291 Black", 15], ["Sikaflex 295 Black", 6], ["Sikaflex 295 White", 3], ["Kent Adhesive White", 1], ["Kent Adhesive Black", 5], ["Kent Rottabond Grey", 4], ["3M Silicone Sealant Clear", 6], ["3M Silicone Sealant White", 10], ["3M Silicone Sealant Black", 2], ["Bostik Black", 4], ["Bostik Grey AC EDILIZIA", 3], ["Bostik Transparent", 1], ["Loctite 5 Minute Epoxy", 7], ["3M Adhesive Sealant 4000UV", 3], ["3M 4200 Black", 2], ["3M 4200 White", 0], ["3M 5200 Black", 2], ["3M 5200 White", 0], ["Supreme Almond Silicone", 5], ["Ottoseal Stone S140", 2], ["Ottoseal Stone Marble S70", 5], ["Wurth Incolla+ Sigilla-grey", 1], ["Teroson MS 939 Black", 2], ["Sikaflex Sika Primer G+P 206", 5]],
  "BOX BS6": [["Acetone 1 litre", 3], ["Alcohol 1 litre", 4], ["Adhesive Remover 1 litre", 2], ["White Spirit 1 litre", 3]],
  "BOX BS7": [["3M P80 Sheets", 2], ["3M P120 Sheets", 2], ["3M P180 Sheets", 1], ["3M P240 Sheets", 1], ["3M P320 Sheets", 3], ["3M P400 Sheets", 2], ["3M P600 Sheets", 1], ["3M P800 Sheets", 1], ["3M P1000 Wet/Dry Sheets", 2], ["3M P1200 Wet/Dry Sheets", 1], ["3M P1500 Wet/Dry Sheets", 1], ["3M Sanding Blocks", 3]],
  "BOX BS8": [["3M P60 Discs", 2], ["3M P80 Discs", 2], ["3M P120 Discs", 3], ["3M P180 Discs", 1], ["3M P220 Discs", 3], ["3M P320 Discs", 1], ["3M P400 Discs", 3], ["3M P3000 Discs", 1], ["3M P4000 Discs", 1], ["3M P6000 Discs", 9], ["Norton P40 Roll", 1], ["Norton P80 Roll", 1], ["Norton P120 Roll", 1], ["Norton P220 Roll", 1], ["Norton P400 Roll", 1], ["Dextor P120 Roll", 2], ["Dextor P180 Roll", 3], ["Dextor P40 Roll", 3], ["Dextor P80 Roll", 3], ["3M P1500 Purple Finishing", 1], ["3M P2000 Purple Finishing", 1]],
  "BOX BS9": [["Reducer T0006", 2], ["Reducer T0031", 4], ["Reducer T0003", 2], ["Awlcat 3", 4], ["Awlcat 2", 2]],
  "BOX BS10": [["High Build Converter D3002", 2], ["High Build White D8002", 1], ["AWLFAIR Red Converter D7222", 2], ["AWLFAIR White Base D8200", 2]],
  "BOX BS11": [["Q2M Iron Spray", 3], ["Whink Rust Stain Remover", 10], ["Clinazur Rust Converter", 2], ["Magica", 6], ["Loctite Naval Jelly", 2]],
  "BOX BS12": [["McLube OneDrop", 2], ["WD40", 7], ["Boeshield T9", 6], ["McLube Dry Lube", 3], ["Super Super Lube", 1], ["Tef Gel", 4], ["PolyMarine PVC Repair", 1]],
  "BOX BS13 LSA": [["Fire Extinguisher Black Ratchet", 11], ["CO2 Cylinders 30g", 13], ["CO2 Cylinders 60g", 6], ["Life Jacket Replacement", 31], ["SDT Smoke Detector Spray", 10], ["Fire Extinguisher Tags", 10], ["Fire Hose Connections", 5], ["Draeger O-Rings", 5], ["Stainless Couplings", 5]],
  "BOX BS14": [["Mixing Pot 30ml", 50], ["Mixing Pot 90ml", 50], ["SISTAR Mixing Pot 300ml", 12], ["SISTAR Mixing Pot 600ml", 20], ["SISTAR Mixing Pot 1100ml", 10], ["MARPRO Mixing Pot 32oz", 23], ["MARPRO Mixing Pot 16oz", 22], ["Mixing Sticks Wood", 40], ["Mixing Sticks Stainless", 2], ["Syringes 10ml", 30]],
  "BOX BS15": [["Preval Spray Cans", 4], ["Preval Spray Glass", 6], ["Redtree Paint Brush 1/2 Inch", 42], ["Redtree Paint Brush 1 Inch", 8], ["Redtree Paint Brush 2 Inch", 33], ["Redtree Foam Brush 1 Inch", 21], ["Redtree Foam Brush 2 Inch", 21], ["Artist Brush Size 2", 5], ["Artist Brush Size 3", 22], ["Artist Brush Size 8", 30], ["3M Fine Line Tape 9mm", 2], ["3M Fine Line Tape 3mm", 5], ["Wire Brush", 7], ["Omega Top Coat Brush 40mm", 7], ["Omega Top Coat Brush 50mm", 7], ["Bristle Brush 50mm", 3], ["Badger Top Coat Brush 2 Inch", 2], ["Badger Top Coat Brush 1 Inch", 4], ["Redtree Top Coat Brush 1 inch", 4], ["Redtree Top Coat Brush 2 Inch", 2], ["Redtree Americana Brush 2.5 Inch", 1], ["Filters", 30]],
  "BOX BS16": [["Whizz Foam Rollers 4 Inch", 46], ["Whizz Foam Rollers 2 Inch", 17], ["Redtree Fluffy Foam Roller", 24], ["Gerson Tack Cloths", 2]],
  "BOX BS17": [["3M Ultrafina SE Polish", 1], ["3M Extra Fine Plus Polish", 1], ["3M Fast Cut Plus Polish", 1], ["3M Perfect It Machine Polish", 3], ["3M Fast Cut Compound", 1]],
  "BOX BS18": [["3M Blue Polishing Pad", 6], ["3M Green Polishing Pad", 9], ["3M Yellow Polishing Pad", 8], ["3M Wool Polishing Pad", 1], ["3M Purple Polishing Pad", 1], ["3M Compounding Pad", 2]],
  "BOX BS19": [["Dexter Black Paint Tray 110ml", 5], ["Dexter Black Paint Tray 250ml", 5], ["Paint Brush Cleaner", 1], ["Paint Roller Holder 2 Inch", 3], ["Paint Roller Holder 4 Inch", 2], ["Paint Roller Holder 10 Inch", 2], ["Paint Mixer for Drill", 2]],
  "BOX BS20": [["International No9 Thinner", 4], ["International No7 Thinner", 6], ["International GTA220 Thinner", 1], ["AwlGrip Nonskid Extra Coarse", 9], ["AwlGrip Nonskid Fine", 1]],
  "BOX BS21": [["AwlGrip 545 Convertor", 1], ["AwlGrip 545 White Base", 1], ["AwlGrip 545 Grey Base", 1], ["AwlGrip Surface Cleaner T0340", 1], ["AwlGrip Awlprep Surface Cleaner", 1], ["AwlGrip Jet Black", 1]],
  "BOX BS22": [["Cable Ties", 2], ["Bunggee Cord", 1]],
  "BOX PPE": [["3M Filter Retainer", 14], ["3M Mask Filters", 12], ["3M Dust Masks", 30], ["3M Disposable Painter Suit", 10], ["3M Safety Glasses", 6], ["3M Half Face Respirator", 8], ["3M Working Gloves", 6]],
  "BOX PS1": [["Spray Nine All Purpose Cleaner 4L", 3], ["Spray Nine All Purpose Cleaner 500ml", 1], ["Star Brite Black Streak Remover 1L", 2], ["Star Brite Black Streak Remover 500ml", 1], ["SYMY Soap 4L", 1]],
  "BOX PS2": [["TD Mop Chamois", 5], ["Yot Mop Absorber Chamois", 4], ["Green Chamois", 6], ["Red Chamois", 4], ["Blue Chamois", 5], ["Purple Chamois", 8]],
  "BOX PS3": [["Unger Ninja Blade Handles", 16], ["Unger ErgoTech Ninja Blade Long", 2], ["Unger ErgoTech Ninja Blade Short", 12], ["Shurhold Wash Mitt", 8], ["Shurhold Sheepskin Wash Mitt", 3], ["Shurhold Lamb Wool Doodlebug", 3], ["Unger ErgoTech Ninja Sleeves", 7]],
  "BOX PS4": [["3M Deck Brush Yellow 10", 6], ["3M Deck Brush Blue 10", 3], ["3M Deck Brush Blue 6", 4], ["3M Doodlebug Holder", 4]],
  "BOX PS5": [["Armorall Protectant Spray", 3], ["303 Protectant Spray", 3], ["Gel Gloss Polish 500ml", 2], ["Gel Gloss Polish 4L", 1], ["Lexol Leather Cleaner", 1], ["Star Brite Sponson Cleaner", 1]],
  "BOX PS6": [["CIF", 17]],
  "BOX PS7": [["Spray Master Spray Bottles", 10]],
  "BOX PS8": [["Yacht Organiser Deck Blade System", 4], ["Yacht Organiser Chamois Holder", 3], ["Yacht Organiser Brush Holder", 1], ["Yacht Organiser Squeegee System", 13], ["Yacht Organiser Plastic Blade Holder", 1], ["Yacht Organiser Chamois Mop Holder", 14], ["Yacht Organiser Pole Holder", 15]],
  "BOX PS9": [["Gardena Male to Male Hose", 7], ["Gardena 3 Way Hose Connector", 1], ["Gardena Tap Connector", 1], ["Gardena Hose Connector", 16], ["Gardena Water Stop Connector", 3], ["Gardena Hose with Valve", 6], ["Gardena Hose Nozzle", 1], ["Shurhold Deck Blade Attachment", 4], ["RainX Water Repellent 500ml", 2], ["RainX Water Repellent 200ml", 3], ["Shurhold Threaded Adaptor", 3]],
  "BOX PS10": [["Autosol Polish", 7], ["Flitz Polish", 6], ["StarClean Wet Polish", 12], ["AwlGrip AwlCare 500ml", 1], ["AwlGrip AwlCare 1/2 Gal", 3], ["Collinite Fleetwax", 8], ["Collinite Insulator Wax", 4], ["Collinite Metal Wax", 5]],
  "BOX PS11": [["Scotch Green Doodlebug Pad", 110], ["3M Brown Doodlebug Pad", 20], ["3M White Doodlebug Pad", 7]],
  "PAINT INVENTORY": [["AwlGrip Max Cor CF Green Primer", 1], ["AwlGrip Max Cor CF Converter", 1], ["AwlGrip HullGuard Primer", 2], ["AwlGrip HullGuard Converter", 3], ["AwlGrip 545 Epoxy Primer Grey", 5], ["International Interior Finish 750", 2], ["International Interior Primer 860", 2], ["International Thinner No9", 2], ["West Systems Epoxy Resin 105", 1], ["West Systems Epoxy Hardener 205", 3], ["Rustoleum Light Grey", 1], ["Rustoleum Black Hammered", 3], ["Rustoleum Satin Black", 4], ["Hammerite Black", 2], ["Hammerite White", 2], ["Hammerite Green", 2], ["Hammerite Red", 2], ["Hammerite Yellow", 2], ["Citron Blue", 4], ["MecanPlast Resin Technology PR21", 2]],
  "ESTECH INVENTORY": [["Estech Repair Compound 56783 A", 11], ["Estech Repair Compound 56783 B", 12], ["Estech Pattern Filler A", 11], ["Estech Pattern Filler B", 11], ["Estech Repair Compound 39520 A", 9], ["Estech Repair Compound 39520 B", 8]]
};

export function loadDefaultInventory(): StockItem[] {
  const items: StockItem[] = [];
  Object.entries(inventoryByBox).forEach(([box, boxItems]) => {
    boxItems.forEach(item => {
      items.push({
        id: Date.now() + Math.random(),
        name: item[0],
        quantity: item[1],
        box: box
      });
    });
  });
  return items;
}
