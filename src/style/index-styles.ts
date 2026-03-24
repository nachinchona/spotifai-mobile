import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    gap: 12,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#1e1e1e",
    borderRadius: 8,
  },
  backButtonText: {
    color: "#1DB954",
    fontSize: 14,
    fontWeight: "600",
  },
  headerTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    flex: 1,
  },
  
  tabsContainer: {
    marginBottom: 15,
    height: 40,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#1e1e1e",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#333",
    justifyContent: 'center',
  },
  tabButtonActive: {
    backgroundColor: "#1DB954",
    borderColor: "#1DB954",
  },
  tabText: {
    color: "#b3b3b3",
    fontSize: 14,
    fontWeight: "600",
    textTransform: 'capitalize'
  },
  tabTextActive: {
    color: "#000000",
    fontWeight: "bold",
  },
  
  card: {
    flexDirection: "row",
    backgroundColor: "#1e1e1e",
    borderRadius: 8,
    marginBottom: 15,
    overflow: "hidden",
    elevation: 3,
  },
  playlistImage: {
    width: 100,
    height: 100,
    alignSelf: 'center',
  },
  textContainer: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },
  playlistName: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  genreTag: {
    color: "#1DB954",
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 4,
    marginTop: 2,
    textTransform: 'capitalize'
  },
  playlistDescription: {
    color: "#b3b3b3",
    fontSize: 12,
    marginTop: 2,
  },
  trackCount: {
    color: "#777",
    fontSize: 11,
    marginTop: 6,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 200,
  },
  errorText: {
    color: "#ff4444",
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  emptyText: {
    color: "#b3b3b3",
    fontSize: 16,
  },
  retryButton: {
    backgroundColor: "#1DB954",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  retryButtonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 14,
  },
  card2: {
    flexDirection: "row",
    alignItems: 'center',
    backgroundColor: "#1e1e1e",
    borderRadius: 8,
    overflow: "hidden",
    elevation: 3,
  },
  deleteAction: {
    backgroundColor: '#dd2c00',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
    borderRadius: 8,
    marginLeft: 10,
    marginBottom: 15,
  }
})