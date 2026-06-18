import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import {
  ActivityIndicator,
  Appbar,
  Avatar,
  Badge,
  Banner,
  BottomNavigation,
  Button as PaperButton,
  Card,
  Checkbox,
  Chip,
  DataTable,
  Dialog,
  Divider,
  Drawer,
  FAB,
  AnimatedFAB,
  HelperText,
  Icon,
  IconButton,
  List,
  Menu,
  Modal,
  ProgressBar,
  RadioButton,
  Searchbar,
  SegmentedButtons,
  Snackbar,
  Surface,
  Switch,
  Text,
  TextInput,
  ToggleButton,
  Tooltip,
  TouchableRipple,
  Portal,
  useTheme,
} from 'react-native-paper';
import { PaperProvider } from 'react-native-paper';

import { ThemedIcon, themedIconNames } from './icons/ThemedIcon.jsx';
import { paperSettings, SvgIcon } from './paperIcon.jsx';

/* ---------- layout helpers ---------- */

// All buttons in the app use an 8px corner radius (override MD3's default
// pill shape). An explicit `style.borderRadius` on any instance still wins.
const Button = ({ style, ...rest }) => (
  <PaperButton style={[{ borderRadius: 8 }, style]} {...rest} />
);

function Section({ title, children }) {
  const theme = useTheme();
  return (
    <View style={{ marginBottom: 28 }}>
      <Text variant="titleMedium" style={{ marginBottom: 4, color: theme.colors.onSurface }}>
        {title}
      </Text>
      <Divider style={{ marginBottom: 12 }} />
      <View style={{ gap: 12 }}>{children}</View>
    </View>
  );
}

function Row({ children }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
      {children}
    </View>
  );
}

/* Token overrides used by the "Modified Components" concept, applied locally
   via a nested PaperProvider so the rest of the catalog stays neutral. */
const fabOverride = (c) => ({ primaryContainer: c.primary, onPrimaryContainer: c.onPrimary });
const containerOverride = (c) => ({
  secondaryContainer: c.primary,
  onSecondaryContainer: c.onPrimary,
});

function Branded({ overrides, children }) {
  const theme = useTheme();
  const t = { ...theme, colors: { ...theme.colors, ...overrides(theme.colors) } };
  return <PaperProvider theme={t} settings={paperSettings}>{children}</PaperProvider>;
}

function ModHint({ children }) {
  const theme = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <Icon source="palette-swatch" size={14} color={theme.colors.primary} />
      <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, flex: 1 }}>
        {children}
      </Text>
    </View>
  );
}

// Selected-chip check rendered as inline SVG (Paper's built-in check uses its
// internal MaterialCommunityIcon, which we don't rely on). useTheme() resolves
// to the nearest provider, so the color is correct inside Branded chips too.
function ChipCheck() {
  const theme = useTheme();
  return <SvgIcon name="check" size={18} color={theme.colors.onSecondaryContainer} />;
}

/* ---------- individual demos ---------- */

function TypographyDemo() {
  const variants = [
    'displaySmall',
    'headlineMedium',
    'titleLarge',
    'titleMedium',
    'bodyLarge',
    'bodyMedium',
    'labelLarge',
    'labelSmall',
  ];
  return (
    <View style={{ gap: 6 }}>
      {variants.map((v) => (
        <Text key={v} variant={v}>
          {v}
        </Text>
      ))}
    </View>
  );
}

function ButtonsDemo() {
  const theme = useTheme();
  return (
    <>
      <Row>
        <Button mode="contained" onPress={() => {}}>Contained</Button>
        <Button mode="contained-tonal" onPress={() => {}}>Tonal</Button>
        <Button mode="elevated" onPress={() => {}}>Elevated</Button>
        <Button mode="outlined" onPress={() => {}}>Outlined</Button>
        <Button mode="text" onPress={() => {}}>Text</Button>
      </Row>
      <Row>
        <Button mode="contained" icon="camera" onPress={() => {}}>Icon</Button>
        <Button mode="contained" loading onPress={() => {}}>Loading</Button>
        <Button mode="contained" disabled onPress={() => {}}>Disabled</Button>
        <Button mode="contained" buttonColor={theme.colors.secondary} onPress={() => {}}>
          Secondary
        </Button>
        <Button mode="contained" buttonColor={theme.colors.tertiary} onPress={() => {}}>
          Tertiary
        </Button>
      </Row>
    </>
  );
}

function FabDemo() {
  const theme = useTheme();
  const [extended, setExtended] = useState(true);
  const [open, setOpen] = useState(false);
  return (
    <>
      <Branded overrides={fabOverride}>
        <Row>
          <FAB icon="plus" size="small" onPress={() => {}} />
          <FAB icon="plus" size="medium" onPress={() => {}} />
          <FAB icon="plus" size="large" onPress={() => {}} />
          <FAB icon="pencil" label="Extended" onPress={() => {}} />
        </Row>
      </Branded>
      <ModHint>Modified: primaryContainer → primary (see Modified Components)</ModHint>
      <Row>
        <FAB icon="star" variant="secondary" onPress={() => {}} />
        <FAB icon="heart" variant="tertiary" onPress={() => {}} />
        <FAB icon="cog" variant="surface" onPress={() => {}} />
      </Row>
      <View style={{ height: 64, justifyContent: 'center' }}>
        <AnimatedFAB
          icon="email"
          label="Animated"
          extended={extended}
          onPress={() => setExtended((e) => !e)}
          animateFrom="left"
          iconMode="dynamic"
          style={{ position: 'relative' }}
        />
      </View>
      <View
        style={{
          height: 200,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: theme.colors.outlineVariant,
          overflow: 'hidden',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: theme.colors.onSurfaceVariant }}>FAB.Group (tap the FAB)</Text>
        <FAB.Group
          open={open}
          visible
          icon={open ? 'close' : 'dots-vertical'}
          actions={[
            { icon: 'plus', label: 'Add', onPress: () => {} },
            { icon: 'star', label: 'Star', onPress: () => {} },
            { icon: 'email', label: 'Email', onPress: () => {} },
          ]}
          onStateChange={({ open }) => setOpen(open)}
          onPress={() => {}}
        />
      </View>
    </>
  );
}

function InputsDemo() {
  const [search, setSearch] = useState('');
  const [text, setText] = useState('');
  const [secure, setSecure] = useState(true);
  return (
    <>
      <Searchbar placeholder="Search" value={search} onChangeText={setSearch} />
      <TextInput
        mode="flat"
        label="Flat input"
        value={text}
        onChangeText={setText}
        left={<TextInput.Icon icon="account" />}
      />
      <TextInput
        mode="outlined"
        label="Outlined input"
        placeholder="Type here"
        right={<TextInput.Affix text="/100" />}
      />
      <TextInput
        mode="outlined"
        label="Password"
        secureTextEntry={secure}
        right={
          <TextInput.Icon
            icon={secure ? 'eye' : 'eye-off'}
            onPress={() => setSecure((s) => !s)}
          />
        }
      />
      <TextInput mode="outlined" label="Multiline" multiline numberOfLines={3} />
      <TextInput mode="outlined" label="Error state" error value="invalid" />
      <HelperText type="error" visible>
        This field has an error.
      </HelperText>
    </>
  );
}

function SelectionDemo() {
  const [checked, setChecked] = useState(true);
  const [item, setItem] = useState(true);
  const [sw, setSw] = useState(true);
  const [radio, setRadio] = useState('first');
  const [segment, setSegment] = useState('walk');
  const [multi, setMulti] = useState(['size']);
  const [toggle, setToggle] = useState('left');
  return (
    <>
      <Row>
        <View style={{ alignItems: 'center' }}>
          <Checkbox status={checked ? 'checked' : 'unchecked'} onPress={() => setChecked((v) => !v)} />
          <Text>Checkbox</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Switch value={sw} onValueChange={setSw} />
          <Text>Switch</Text>
        </View>
      </Row>
      <Checkbox.Item
        label="Checkbox.Item"
        status={item ? 'checked' : 'unchecked'}
        onPress={() => setItem((v) => !v)}
      />
      <RadioButton.Group onValueChange={setRadio} value={radio}>
        <RadioButton.Item label="Radio option one" value="first" />
        <RadioButton.Item label="Radio option two" value="second" />
      </RadioButton.Group>
      <Branded overrides={containerOverride}>
        <SegmentedButtons
          value={segment}
          onValueChange={setSegment}
          buttons={[
            { value: 'walk', label: 'Walk', icon: 'walk' },
            { value: 'train', label: 'Transit', icon: 'train' },
            { value: 'drive', label: 'Drive', icon: 'car' },
          ]}
        />
      </Branded>
      <ModHint>Selected segment — modified: secondaryContainer → primary (see Modified Components)</ModHint>
      <SegmentedButtons
        multiSelect
        value={multi}
        onValueChange={setMulti}
        buttons={[
          { value: 'size', label: 'Size' },
          { value: 'color', label: 'Color' },
          { value: 'fit', label: 'Fit' },
        ]}
      />
      <ToggleButton.Row onValueChange={setToggle} value={toggle}>
        <ToggleButton icon="format-align-left" value="left" />
        <ToggleButton icon="format-align-center" value="center" />
        <ToggleButton icon="format-align-right" value="right" />
      </ToggleButton.Row>
    </>
  );
}

function ChipsDemo() {
  const [sel, setSel] = useState(true);
  return (
    <>
      <Row>
        <Chip icon="information" onPress={() => {}}>Assist</Chip>
        <Branded overrides={containerOverride}>
          <Chip
            selected={sel}
            showSelectedCheck={false}
            icon={sel ? () => <ChipCheck /> : undefined}
            onPress={() => setSel((v) => !v)}
          >
            Filter
          </Chip>
        </Branded>
        <Chip icon="account" onClose={() => {}}>Input</Chip>
        <Chip mode="outlined" avatar={<Avatar.Text size={24} label="K" />}>Avatar</Chip>
        <Chip mode="flat" elevated onPress={() => {}}>Elevated</Chip>
        <Chip disabled>Disabled</Chip>
      </Row>
      <ModHint>Selected/filter chip — modified: secondaryContainer → primary (see Modified Components)</ModHint>
    </>
  );
}

function CardsDemo() {
  return (
    <>
      <Card mode="elevated">
        <Card.Cover source={{ uri: 'https://picsum.photos/seed/paperui/600/300' }} />
        <Card.Title
          title="Elevated card"
          subtitle="With cover image"
          left={(props) => <Avatar.Icon {...props} icon="folder" />}
          right={(props) => <IconButton {...props} icon="dots-vertical" onPress={() => {}} />}
        />
        <Card.Content>
          <Text variant="bodyMedium">
            Surface stays neutral; the action buttons carry the brand color.
          </Text>
        </Card.Content>
        <Card.Actions>
          <Button onPress={() => {}}>Cancel</Button>
          <Button mode="contained" onPress={() => {}}>Confirm</Button>
        </Card.Actions>
      </Card>
      <Card mode="outlined">
        <Card.Content>
          <Text variant="titleMedium">Outlined card</Text>
          <Text variant="bodyMedium">Bordered with the neutral outline token.</Text>
        </Card.Content>
      </Card>
    </>
  );
}

function SurfaceDemo() {
  return (
    <Row>
      {[1, 2, 3, 4, 5].map((lvl) => (
        <Surface key={lvl} elevation={lvl} style={{ padding: 16, borderRadius: 12 }}>
          <Text>Elev {lvl}</Text>
        </Surface>
      ))}
    </Row>
  );
}

function ListsDemo() {
  const [sw, setSw] = useState(true);
  return (
    <List.Section>
      <List.Subheader>Settings</List.Subheader>
      <List.Item
        title="Profile"
        description="Account details"
        left={(props) => <List.Icon {...props} icon="account" />}
      />
      <Divider />
      <List.Item
        title="Notifications"
        description="Push and email"
        left={(props) => <List.Icon {...props} icon="bell" />}
        right={() => <Switch value={sw} onValueChange={setSw} />}
      />
      <Divider />
      <List.Accordion
        title="Expandable section"
        left={(props) => <List.Icon {...props} icon="cog" />}
      >
        <List.Item title="Nested item one" />
        <List.Item title="Nested item two" />
      </List.Accordion>
    </List.Section>
  );
}

function DataTableDemo() {
  const [page, setPage] = useState(0);
  const perPage = 3;
  const items = [
    { name: 'Cupcake', calories: 356, fat: 16 },
    { name: 'Eclair', calories: 262, fat: 16 },
    { name: 'Frozen yogurt', calories: 159, fat: 6 },
    { name: 'Gingerbread', calories: 305, fat: 3.7 },
    { name: 'Ice cream', calories: 237, fat: 9 },
  ];
  const from = page * perPage;
  const to = Math.min((page + 1) * perPage, items.length);
  return (
    <DataTable>
      <DataTable.Header>
        <DataTable.Title>Dessert</DataTable.Title>
        <DataTable.Title numeric>Calories</DataTable.Title>
        <DataTable.Title numeric>Fat</DataTable.Title>
      </DataTable.Header>
      {items.slice(from, to).map((it) => (
        <DataTable.Row key={it.name}>
          <DataTable.Cell>{it.name}</DataTable.Cell>
          <DataTable.Cell numeric>{it.calories}</DataTable.Cell>
          <DataTable.Cell numeric>{it.fat}</DataTable.Cell>
        </DataTable.Row>
      ))}
      <DataTable.Pagination
        page={page}
        numberOfPages={Math.ceil(items.length / perPage)}
        onPageChange={setPage}
        label={`${from + 1}-${to} of ${items.length}`}
      />
    </DataTable>
  );
}

function AvatarBadgeDemo() {
  const theme = useTheme();
  return (
    <Row>
      <Avatar.Text size={48} label="AB" />
      <Avatar.Icon size={48} icon="account" />
      <Avatar.Icon size={48} icon="star" style={{ backgroundColor: theme.colors.tertiary }} />
      <Avatar.Image size={48} source={{ uri: 'https://i.pravatar.cc/96?img=12' }} />
      <View>
        <Avatar.Icon size={48} icon="bell" />
        <Badge style={{ position: 'absolute', top: -2, right: -2 }}>4</Badge>
      </View>
      <Badge>New</Badge>
    </Row>
  );
}

function MenuDemo() {
  const [visible, setVisible] = useState(false);
  return (
    <Menu
      visible={visible}
      onDismiss={() => setVisible(false)}
      anchor={
        <Button mode="outlined" icon="menu" onPress={() => setVisible(true)}>
          Open menu
        </Button>
      }
    >
      <Menu.Item leadingIcon="content-copy" onPress={() => {}} title="Copy" />
      <Menu.Item leadingIcon="content-paste" onPress={() => {}} title="Paste" />
      <Divider />
      <Menu.Item leadingIcon="delete" onPress={() => {}} title="Delete" />
    </Menu>
  );
}

function DrawerDemo() {
  const [active, setActive] = useState('inbox');
  const items = [
    { key: 'inbox', label: 'Inbox', icon: 'inbox' },
    { key: 'starred', label: 'Starred', icon: 'star' },
    { key: 'sent', label: 'Sent mail', icon: 'send' },
    { key: 'trash', label: 'Trash', icon: 'delete' },
  ];
  return (
    <Surface elevation={1} style={{ borderRadius: 12, overflow: 'hidden' }}>
      <Drawer.Section title="Mailboxes">
        {items.map((it) => (
          <Drawer.Item
            key={it.key}
            label={it.label}
            icon={it.icon}
            active={active === it.key}
            onPress={() => setActive(it.key)}
          />
        ))}
      </Drawer.Section>
    </Surface>
  );
}

function BottomNavDemo() {
  const theme = useTheme();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'home', title: 'Home', focusedIcon: 'home', unfocusedIcon: 'home-outline' },
    { key: 'explore', title: 'Explore', focusedIcon: 'compass', unfocusedIcon: 'compass-outline' },
    { key: 'alerts', title: 'Alerts', focusedIcon: 'bell', unfocusedIcon: 'bell-outline' },
    { key: 'profile', title: 'Profile', focusedIcon: 'account', unfocusedIcon: 'account-outline' },
  ]);
  const Scene = ({ label }) => (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant }}>
        {label} screen
      </Text>
    </View>
  );
  const renderScene = BottomNavigation.SceneMap({
    home: () => <Scene label="Home" />,
    explore: () => <Scene label="Explore" />,
    alerts: () => <Scene label="Alerts" />,
    profile: () => <Scene label="Profile" />,
  });
  return (
    <View
      style={{
        height: 320,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: theme.colors.outlineVariant,
      }}
    >
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
      />
    </View>
  );
}

function AppbarDemo() {
  return (
    <View style={{ gap: 12 }}>
      <Appbar.Header elevated style={{ borderRadius: 8, overflow: 'hidden' }}>
        <Appbar.Action icon="arrow-left" onPress={() => {}} />
        <Appbar.Content title="Title" subtitle="Subtitle" />
        <Appbar.Action icon="magnify" onPress={() => {}} />
        <Appbar.Action icon="dots-vertical" onPress={() => {}} />
      </Appbar.Header>
      <Appbar style={{ borderRadius: 8 }}>
        <Appbar.Action icon="archive" onPress={() => {}} />
        <Appbar.Action icon="email" onPress={() => {}} />
        <View style={{ flex: 1 }} />
        <Appbar.Action icon="delete" onPress={() => {}} />
      </Appbar>
    </View>
  );
}

function FeedbackDemo() {
  const theme = useTheme();
  const [snackbar, setSnackbar] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [modal, setModal] = useState(false);
  return (
    <>
      <Row>
        <Button mode="contained" onPress={() => setSnackbar(true)}>Snackbar</Button>
        <Button mode="outlined" onPress={() => setDialog(true)}>Dialog</Button>
        <Button mode="elevated" onPress={() => setModal(true)}>Modal</Button>
        <Tooltip title="A helpful tooltip">
          <Button mode="text" onPress={() => {}}>Tooltip</Button>
        </Tooltip>
      </Row>
      <ProgressBar progress={0.6} />
      <Row>
        <ActivityIndicator animating size="small" />
        <ActivityIndicator animating size="large" />
      </Row>

      <Portal>
        <Dialog visible={dialog} onDismiss={() => setDialog(false)}>
          <Dialog.Icon icon="alert" />
          <Dialog.Title>Dialog title</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Dialog surface is neutral; only the actions show brand color.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialog(false)}>Cancel</Button>
            <Button mode="contained" onPress={() => setDialog(false)}>OK</Button>
          </Dialog.Actions>
        </Dialog>

        <Modal
          visible={modal}
          onDismiss={() => setModal(false)}
          contentContainerStyle={{
            backgroundColor: theme.colors.surface,
            margin: 24,
            padding: 24,
            borderRadius: 16,
            gap: 12,
          }}
        >
          <Text variant="titleMedium">Paper Modal</Text>
          <Text variant="bodyMedium">A blank canvas you fill with any content.</Text>
          <Button mode="contained" onPress={() => setModal(false)}>Close</Button>
        </Modal>
      </Portal>

      <Snackbar
        visible={snackbar}
        onDismiss={() => setSnackbar(false)}
        action={{ label: 'Undo', onPress: () => {} }}
      >
        This is a snackbar message.
      </Snackbar>
    </>
  );
}

function MiscDemo() {
  const theme = useTheme();
  return (
    <>
      <Row>
        <Icon source="camera" size={28} />
        <Icon source="heart" size={28} color={theme.colors.primary} />
        <Icon source="star" size={28} color={theme.colors.secondary} />
        <Icon source="bell" size={28} color={theme.colors.tertiary} />
        <IconButton icon="heart" mode="contained" onPress={() => {}} />
        <IconButton icon="star" mode="contained-tonal" onPress={() => {}} />
        <IconButton icon="pencil" mode="outlined" onPress={() => {}} />
      </Row>
      <TouchableRipple
        onPress={() => {}}
        style={{ padding: 16, borderRadius: 12, backgroundColor: theme.colors.surfaceVariant }}
      >
        <Text>TouchableRipple — tap me for a ripple</Text>
      </TouchableRipple>
    </>
  );
}

function ThemedIconsDemo() {
  const theme = useTheme();
  return (
    <>
      <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
        Glyph = Primary, container = Primary at 20%. A single brand color drives both tones.
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
        {themedIconNames.map((name) => (
          <View key={name} style={{ alignItems: 'center', gap: 6, width: 72 }}>
            <ThemedIcon name={name} size={44} />
            <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
              {name}
            </Text>
          </View>
        ))}
      </View>
    </>
  );
}

/* ---------- catalog ---------- */

const SECTIONS = [
  { title: 'Typography', cat: 'Foundations', Comp: TypographyDemo },
  { title: 'Icon, IconButton & TouchableRipple', cat: 'Foundations', Comp: MiscDemo },
  { title: 'Themed two-tone icons', cat: 'Foundations', Comp: ThemedIconsDemo },
  { title: 'Buttons', cat: 'Actions', Comp: ButtonsDemo },
  { title: 'FAB', cat: 'Actions', Comp: FabDemo },
  { title: 'Inputs & Searchbar', cat: 'Inputs', Comp: InputsDemo },
  { title: 'Selection controls', cat: 'Inputs', Comp: SelectionDemo },
  { title: 'Chips', cat: 'Inputs', Comp: ChipsDemo },
  { title: 'Cards', cat: 'Containment', Comp: CardsDemo },
  { title: 'Surfaces', cat: 'Containment', Comp: SurfaceDemo },
  { title: 'Lists', cat: 'Containment', Comp: ListsDemo },
  { title: 'Data table', cat: 'Containment', Comp: DataTableDemo },
  { title: 'Avatars & badges', cat: 'Containment', Comp: AvatarBadgeDemo },
  { title: 'Appbar', cat: 'Navigation', Comp: AppbarDemo },
  { title: 'Bottom navigation', cat: 'Navigation', Comp: BottomNavDemo },
  { title: 'Menu', cat: 'Navigation', Comp: MenuDemo },
  { title: 'Drawer', cat: 'Navigation', Comp: DrawerDemo },
  { title: 'Dialog, Modal, Snackbar & more', cat: 'Feedback', Comp: FeedbackDemo },
];

/* ---------- bottom-navigation destinations (grouped categories) ---------- */

const NAV_ROUTES = [
  {
    key: 'basics',
    title: 'Basics',
    cats: ['Foundations'],
    focusedIcon: 'shape',
    unfocusedIcon: 'shape-outline',
  },
  {
    key: 'input',
    title: 'Input',
    cats: ['Actions', 'Inputs'],
    focusedIcon: 'gesture-tap-button',
    unfocusedIcon: 'gesture-tap',
  },
  {
    key: 'layout',
    title: 'Layout',
    cats: ['Containment'],
    focusedIcon: 'card',
    unfocusedIcon: 'card-outline',
  },
  {
    key: 'navfeedback',
    title: 'Nav & Feedback',
    cats: ['Navigation', 'Feedback'],
    focusedIcon: 'compass',
    unfocusedIcon: 'compass-outline',
  },
];

/* A single bottom-nav destination: the sections for its group. */
function CategoryScene({ cats }) {
  const theme = useTheme();
  const filtered = SECTIONS.filter((s) => cats.includes(s.cat));
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }} style={{ flex: 1 }}>
        {filtered.map(({ title, Comp }) => (
          <Section key={title} title={title}>
            <Comp />
          </Section>
        ))}
      </ScrollView>
    </View>
  );
}

/* ---------- themed two-tone icon page ---------- */

/* ---------- modified components page ---------- */

function applyOverrides(theme, overrides) {
  return { ...theme, colors: { ...theme.colors, ...overrides } };
}

function TokenPill({ name, value }) {
  const theme = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: theme.colors.outlineVariant,
      }}
    >
      <View
        style={{
          width: 14,
          height: 14,
          borderRadius: 7,
          backgroundColor: value,
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.15)',
        }}
      />
      <Text variant="labelSmall">{name}</Text>
    </View>
  );
}

// Small self-contained examples reused for the before/after columns.
function ChipExample() {
  const [sel, setSel] = useState(true);
  return (
    <Chip
      selected={sel}
      showSelectedCheck={false}
      icon={sel ? () => <ChipCheck /> : undefined}
      onPress={() => setSel((v) => !v)}
    >
      Filter
    </Chip>
  );
}
function SegExample() {
  const [v, setV] = useState('day');
  return (
    <SegmentedButtons
      value={v}
      onValueChange={setV}
      buttons={[
        { value: 'day', label: 'Day' },
        { value: 'week', label: 'Week' },
        { value: 'month', label: 'Month' },
      ]}
    />
  );
}
function FabExample() {
  return <FAB icon="plus" onPress={() => {}} />;
}

function ModifiedComponentsPage({ onBack }) {
  const theme = useTheme();
  const c = theme.colors;

  const mods = [
    {
      name: 'Chip (selected / filter)',
      note: 'Selected chips use the secondary container, which is neutral — so they look grey. Reassign them to Primary.',
      changes: [
        { from: 'secondaryContainer', to: 'primary' },
        { from: 'onSecondaryContainer', to: 'onPrimary' },
      ],
      overrides: { secondaryContainer: c.primary, onSecondaryContainer: c.onPrimary },
      Demo: ChipExample,
    },
    {
      name: 'Segmented buttons (selected)',
      note: 'The selected segment also fills with the secondary container. Reassign to Primary.',
      changes: [
        { from: 'secondaryContainer', to: 'primary' },
        { from: 'onSecondaryContainer', to: 'onPrimary' },
      ],
      overrides: { secondaryContainer: c.primary, onSecondaryContainer: c.onPrimary },
      Demo: SegExample,
    },
    {
      name: 'FAB',
      note: 'The FAB background uses the primary container (neutral). Reassign to Primary.',
      changes: [
        { from: 'primaryContainer', to: 'primary' },
        { from: 'onPrimaryContainer', to: 'onPrimary' },
      ],
      overrides: { primaryContainer: c.primary, onPrimaryContainer: c.onPrimary },
      Demo: FabExample,
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      <Appbar.Header>
        <Appbar.Action icon="arrow-left" onPress={onBack} />
        <Appbar.Content title="Modified Components" subtitle="Token reassignments → brand color" />
      </Appbar.Header>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }} style={{ flex: 1 }}>
        <Text variant="bodyMedium" style={{ color: c.onSurfaceVariant, marginBottom: 16 }}>
          Forcing many tokens to neutral makes some components render grey. Here we reassign a
          few component tokens back to the brand colors. Each card shows the token change and a
          before / after comparison.
        </Text>

        {mods.map((m) => (
          <Surface
            key={m.name}
            elevation={1}
            style={{ borderRadius: 12, padding: 16, marginBottom: 16, gap: 12 }}
          >
            <Text variant="titleSmall">{m.name}</Text>
            <Text variant="bodySmall" style={{ color: c.onSurfaceVariant }}>
              {m.note}
            </Text>

            <View style={{ gap: 6 }}>
              {m.changes.map((ch) => (
                <View
                  key={ch.from}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}
                >
                  <TokenPill name={ch.from} value={c[ch.from]} />
                  <Text variant="bodyMedium" style={{ color: c.onSurfaceVariant }}>→</Text>
                  <TokenPill name={ch.to} value={c[ch.to]} />
                </View>
              ))}
            </View>

            <Divider />

            <View style={{ flexDirection: 'row', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <View style={{ gap: 6 }}>
                <Text variant="labelSmall" style={{ color: c.onSurfaceVariant }}>Before</Text>
                <m.Demo />
              </View>
              <View style={{ gap: 6 }}>
                <Text variant="labelSmall" style={{ color: c.onSurfaceVariant }}>After</Text>
                <PaperProvider theme={applyOverrides(theme, m.overrides)} settings={paperSettings}>
                  <m.Demo />
                </PaperProvider>
              </View>
            </View>
          </Surface>
        ))}
      </ScrollView>
    </View>
  );
}

/* ---------- root ---------- */

export default function Showcase() {
  const [bannerVisible, setBannerVisible] = useState(true);
  const [index, setIndex] = useState(0);
  const [modPage, setModPage] = useState(false);

  const active = NAV_ROUTES[index];

  const renderScene = ({ route }) => <CategoryScene cats={route.cats} />;

  if (modPage) {
    return <ModifiedComponentsPage onBack={() => setModPage(false)} />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title="Component Catalog" subtitle={active.title} />
        <Appbar.Action icon="palette" onPress={() => {}} />
        <Appbar.Action icon="palette-swatch" onPress={() => setModPage(true)} />
      </Appbar.Header>

      <Banner
        visible={bannerVisible}
        actions={[
          { label: 'View modified components', onPress: () => setModPage(true) },
          { label: 'Got it', onPress: () => setBannerVisible(false) },
        ]}
      >
        <Text variant="bodySmall">
          Only Primary, Secondary and Tertiary come from the brand — everything else is neutral.
          Some components are reassigned back to brand color.
        </Text>
      </Banner>

      <BottomNavigation
        navigationState={{ index, routes: NAV_ROUTES }}
        onIndexChange={setIndex}
        renderScene={renderScene}
        shifting
      />
    </View>
  );
}
